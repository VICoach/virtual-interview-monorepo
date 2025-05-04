from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from api.controllers.voice_controller import speech_to_text_controller, text_to_speech_controller
from api.utils.agent import Agent
from api.logger import logger

logger = logger.get_logger(__name__)
router = APIRouter()

@router.websocket("/ws/audio-stream")
async def audio_stream(websocket: WebSocket):
    await websocket.accept()

    agent = Agent()

    logger.info("WebSocket connection established")

    response = await agent.invoque(
        message="Hello, there!",
    )

    tts_audio_bytes = await text_to_speech_controller(response)

    await websocket.send_json({"response": response})

    await websocket.send_bytes(tts_audio_bytes)

    try:
        while True:
            # Wait for raw audio bytes
            audio_bytes = await websocket.receive_bytes()
            logger.debug(f"Received audio bytes: {len(audio_bytes)} bytes")
            # Transcribe
            transcript = await speech_to_text_controller(audio_bytes)

            # Agent Response
            response = await agent.invoque(
                message=transcript,
            )

            # Convert transcript to TTS audio
            tts_audio_bytes = await text_to_speech_controller(response)

            # Send result: first JSON metadata
            await websocket.send_json({"response": response})

            # Then send the audio separately as binary
            await websocket.send_bytes(tts_audio_bytes)

    except WebSocketDisconnect:
        logger.info("WebSocket connection closed")
    except Exception as e:
        await websocket.send_json({"error": str(e)})
