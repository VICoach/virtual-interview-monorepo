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
    async with websockets.connect(AGENT_WS_URL) as websocket:
        # Receive the welcome message from the agent
        response = await websocket.recv()

        # Send the transcribed message to the agent
        await websocket.send(message)

        # Receive the agent's response
        response = await websocket.recv()
        return response

@app.post("/interview/")
async def process_interview(audio: UploadFile = File(...)):
    try:
        # STEP 1: Save the uploaded audio
            # Create a unique filename using UUID
        temp_filename = f"{uuid.uuid4()}.mp3"
        temp_file_path = os.path.join(TEMP_DIR, temp_filename)
        
            # Save the uploaded audio file to the temporary directory
        with open(temp_file_path, "wb") as f:
            f.write(await audio.read())

        # STEP 2: Transcribe the audio to text
        text = await transcribe_audio(temp_file_path)

        # STEP 3: Get AI response from agent
        ai_reply = await communicate_with_agent(text)

        # STEP 4: Return the audio stream
        return StreamingResponse(stream_speech(ai_reply), media_type="audio/wav")

    except Exception as e:
        # In case of any error, return a 500 status code and the error message
        return JSONResponse(status_code=500, content={"error": str(e)})

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    print("🔌 Incoming WebSocket connection...")
    await websocket.accept()
    try:
        # Connect to the agent WebSocket server
        async with websockets.connect(
            AGENT_WS_URL,
            ping_interval=3600,
            ping_timeout=3600
        ) as agent_ws:
            # Receive the welcome message from agent
            agent_msg = await agent_ws.recv()
            await websocket.send_text(agent_msg)

            # Bridge messages between client and agent
            while True:
                user_msg = await websocket.receive_text()
                await agent_ws.send(user_msg)
                agent_reply = await agent_ws.recv()
                await websocket.send_text(agent_reply)

    except WebSocketDisconnect:
        print("Client disconnected")

    except Exception as e:
        await websocket.send_text(f"Error: {str(e)}")