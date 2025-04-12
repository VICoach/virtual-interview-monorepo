import asyncio
import requests
import time
import gdown
import soundfile as sf
import io

# Extract the file from the Google Drive link
file_id = "1--pzotRY7K8y_lr6CniVr4wJa9_fvhhS"
AUDIO_FILE = "audio_file.mp3"
gdown.download(f"https://drive.google.com/uc?id={file_id}", AUDIO_FILE, quiet=False)
GROQ_API_KEY = "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"
GROQ_MODEL = "llama-3.3-70b-versatile"
GROQ_WHISPER_MODEL = "whisper-large-v3"
GROQ_TTS_MODEL = "playai-tts"

# Step 1: Asynchronous Speech-to-Text (STT) using Groq Whisper
async def transcribe_audio(audio_path):
    start_time = time.time()
    with open(audio_path, "rb") as audio_file:
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
async def stream_speech(text):

    start_time = time.time()

    # Step 1: Request audio from PlayHT-TTS via Groq
    url = "https://api.groq.com/openai/v1/audio/speech"
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": GROQ_TTS_MODEL,
        "input": text,
        "voice": "Chip-PlayAI",  # Customize as needed
        "response_format": "wav"
    }

    response = requests.post(url, json=payload, headers=headers)
    if response.status_code != 200:
        print("Error generating speech:", response.json())
        yield b""
        return

    # Step 2: Load audio into memory
    audio_bytes = io.BytesIO(response.content)
    data, samplerate = sf.read(audio_bytes)

    # Step 3: Simulate streaming by chunking the audio
    chunk_duration = 0.5  # seconds
    chunk_size = int(chunk_duration * samplerate)
    num_chunks = len(data) // chunk_size + (1 if len(data) % chunk_size != 0 else 0)

    for i in range(num_chunks):
        start = i * chunk_size
        end = start + chunk_size
        chunk_data = data[start:end]

        if len(chunk_data) == 0:
            continue

        # Convert the chunk back to WAV bytes
        buffer = io.BytesIO()
        sf.write(buffer, chunk_data, samplerate, format='WAV')
        yield buffer.getvalue()
        await asyncio.sleep(chunk_duration)
        