import asyncio
import requests
import time
import gdown
import soundfile as sf
import io
from elevenlabs import ElevenLabs

# Extract the file from the Google Drive link
file_id = "1--pzotRY7K8y_lr6CniVr4wJa9_fvhhS"
AUDIO_FILE = "audio_file.mp3"
gdown.download(f"https://drive.google.com/uc?id={file_id}", AUDIO_FILE, quiet=False)
GROQ_API_KEY = "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"
GROQ_MODEL = "llama-3.3-70b-versatile"
GROQ_WHISPER_MODEL = "whisper-large-v3"
GROQ_TTS_MODEL = "playai-tts"
ELEVEN_LABS_API_KEY="sk_65537218b39432e549f8bbf9b0d4974eff0dad1cbfaf2bff"

# Step 1: Asynchronous Speech-to-Text (STT) using Groq Whisper
async def transcribe_audio(audio_bytes: bytes):
    start_time = time.time()

    # Create an in-memory file-like object
    audio_file = io.BytesIO(audio_bytes)
    audio_file.name = "audio.wav"  # Required for the multipart/form-data

    files = {"file": audio_file}
    headers = {"Authorization": f"Bearer {GROQ_API_KEY}"}
    payload = {"model": GROQ_WHISPER_MODEL}
    url = "https://api.groq.com/openai/v1/audio/transcriptions"

    response = requests.post(url, headers=headers, files=files, data=payload)
    response_json = response.json()

    elapsed_time = time.time() - start_time
    print(f"Transcription Time: {elapsed_time:.2f} seconds")

    return response_json.get("text", "Error in transcription")

# Step 3: Stream TTS response
elevenlabs_client = None

def connect_elevenlabs():
    global elevenlabs_client
    if elevenlabs_client is None:
        elevenlabs_client = ElevenLabs(api_key=ELEVEN_LABS_API_KEY)
    return elevenlabs_client


def get_elevenlabs_client():
    connect_elevenlabs()
    voice_client = elevenlabs_client
    return voice_client

async def stream_speech(text):
    """
    Asynchronously generates and streams audio from ElevenLabs using a generator.
    Streams MP3 chunks via an async generator.
    """
    voice_client = get_elevenlabs_client()
    audio_generator = voice_client.text_to_speech.convert(
        voice_id="21m00Tcm4TlvDq8ikWAM",       # Default ElevenLabs voice ID
        output_format="mp3_22050_32",         # Adjust output format as needed
        text=text,
        model_id="eleven_v2_5_flash",
    )

    
    audio_data = b"".join(chunk for chunk in audio_generator)
    return audio_data
