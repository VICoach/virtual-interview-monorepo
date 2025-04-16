from fastapi import FastAPI, File, UploadFile, WebSocket, WebSocketDisconnect
from fastapi.responses import JSONResponse, StreamingResponse
import os
import uuid
import websockets
import websockets
from STT_TTS import transcribe_audio, stream_speech

app = FastAPI()

# Temporary directory to store audio files
TEMP_DIR = "temp_files"

# Create the directory if it doesn't exist
os.makedirs(TEMP_DIR, exist_ok=True)

# WebSocket agent settings
AGENT_WS_URL = "ws://localhost:8765"  # URL of your WebSocket server

async def communicate_with_agent(message: str) -> str:
    """Send the transcribed message to the WebSocket agent and return the response."""
    async with websockets.connect(
        AGENT_WS_URL,
        ping_interval=3600,
        ping_timeout=3600,
    ) as websocket:
        # Receive the welcome message from the agent
        response = await websocket.recv()

        # Send the transcribed message to the agent
        await websocket.send(message)

        # Receive the agent's response
        response = await websocket.recv()
        return response

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    print("🔌 Incoming WebSocket connection...")
    await websocket.accept()
    try:
        # Receive audio bytes
        audio_data = await websocket.receive_bytes()

        # Save to temp file
        temp_filename = f"{uuid.uuid4()}.mp3"
        temp_file_path = os.path.join(TEMP_DIR, temp_filename)
        with open(temp_file_path, "wb") as f:
            f.write(audio_data)

        # Transcribe audio
        user_text = await transcribe_audio(temp_file_path)

        # Send to agent via WebSocket and get reply
        ai_reply = await communicate_with_agent(user_text)

        # Generate TTS response (WAV audio)
        audio_stream = stream_speech(ai_reply)

        # Read audio into bytes
        audio_bytes = b"".join([chunk async for chunk in audio_stream])

        # Send back both text and audio
        await websocket.send_json({"text": ai_reply})
        await websocket.send_bytes(audio_bytes)

    except WebSocketDisconnect:
        print("Client disconnected")

    except Exception as e:
        await websocket.send_json({"error": str(e)})