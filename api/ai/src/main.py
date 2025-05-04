from fastapi import FastAPI, WebSocket, WebSocketDisconnect
import os
import uuid
import base64
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
        # Receive message (including the Base64 audio data)
        message = await websocket.receive_bytes()
        print(f"Received message of {len(message)} bytes")

        # Transcribe audio
        user_text = await transcribe_audio(message)
        print(f"Transcription: {user_text}")

        # Send to agent via WebSocket and get the response
        ai_reply = await communicate_with_agent(user_text)
        print(f"AI Reply: {ai_reply}")

        # Generate TTS response (WAV audio)
        audio_stream = await stream_speech(ai_reply)
        print(f"Generated TTS audio of {len(audio_stream)} bytes")

        # # Send back both text and audio
        # await websocket.send_json({
        #     "text": ai_reply,
        #     "audio": audio_stream
        # })
        # await websocket.send_bytes(audio_bytes)
        await websocket.send_bytes(audio_stream)

    except WebSocketDisconnect:
        print("Client disconnected")

    except Exception as e:
        await websocket.send_json({"error": str(e)})