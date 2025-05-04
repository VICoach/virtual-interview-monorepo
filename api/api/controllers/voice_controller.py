from api.services.voice_service import groq_transcribe, text_to_speech
from api.logger import logger
import tempfile
import asyncio
import os


PROJECT_DIR = os.path.dirname(__file__)
TEMP_DIR = os.path.join(PROJECT_DIR, "temp_audio")
os.makedirs(TEMP_DIR, exist_ok=True)
logger = logger.get_logger(__name__)

async def speech_to_text_controller(audio_bytes: bytes) -> str:
    with tempfile.NamedTemporaryFile(delete=False, suffix=".mp3", dir=TEMP_DIR) as temp_audio:
        logger.debug(f"Creating temp audio file: {temp_audio.name}")
        temp_audio.write(audio_bytes)
        temp_audio.flush()
        temp_audio_path = temp_audio.name

    print(f"Temporary audio file created: {temp_audio_path}")
    try:
        result = await groq_transcribe(temp_audio_path)
        await asyncio.sleep(0.2)  # Give OS time to release file handle
        return result
    finally:
        try:
            os.remove(temp_audio_path)
            logger.debug(f"Deleted temp audio file: {temp_audio_path}")
        except Exception as e:
            logger.error(f"Error deleting temp audio file: {temp_audio_path}, Error: {str(e)}")
            raise e


async def text_to_speech_controller(text: str) -> bytes:
    audio_data = await text_to_speech(text)
    if not audio_data or len(audio_data) == 0:
        raise ValueError("Generated audio data is empty.")
    return audio_data
