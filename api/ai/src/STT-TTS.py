import asyncio
import requests
import IPython.display as ipd
import time
from elevenlabs import ElevenLabs
import gdown
import soundfile as sf

# Extract the file from the Google Drive link
file_id = "1--pzotRY7K8y_lr6CniVr4wJa9_fvhhS"
AUDIO_FILE = "audio_file.mp3"
gdown.download(f"https://drive.google.com/uc?id={file_id}", AUDIO_FILE, quiet=False)
GROQ_API_KEY = "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"
GROQ_MODEL = "llama-3.3-70b-versatile"
GROQ_WHISPER_MODEL = "whisper-large-v3"
GROQ_TTS_MODEL = "playai-tts"
#ELEVENLABS_API_KEY = "sk_8be7748ac2a9dd3d3fedb1b62a1b8dffb6a33f8a8958eaf8"
#ELEVENLABS_VOICE_ID = "JBFqnCBsd6RMkjVDRZzb"  # Set to your preferred ElevenLabs voice ID
#ELEVENLABS_MODEL_ID = "eleven_multilingual_v2"

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

# Step 2: Asynchronous AI Evaluation and Improvement
async def get_ai_feedback(user_response):
    start_time = time.time()
    prompt = (
        "You are an AI interview coach. A candidate has answered the question: 'Tell me about yourself.' "
        "Provide a brief analysis of their response, highlighting their key strengths and areas for improvement."
        "Keep your feedback structured, concise, and actionable.\n\n"
        f"Candidate's response: {user_response}"
    )
    url = "https://api.groq.com/openai/v1/chat/completions"
    headers = {"Authorization": f"Bearer {GROQ_API_KEY}", "Content-Type": "application/json"}
    payload = {"model": GROQ_MODEL, "messages": [{"role": "user", "content": prompt}], "temperature": 0.7}
    response = requests.post(url, json=payload, headers=headers)
    response_json = response.json()
    elapsed_time = time.time() - start_time
    print(f"AI Feedback Time: {elapsed_time:.2f} seconds")
    return response_json["choices"][0]["message"]["content"]

# Step 3: Stream TTS response using ElevenLabs
async def stream_speech(text):
    """start_time = time.time()
    client = ElevenLabs(api_key=ELEVENLABS_API_KEY)

    # Get streaming audio
    audio_stream = client.text_to_speech.convert_as_stream(
        voice_id=ELEVENLABS_VOICE_ID,
        output_format="mp3_44100_128",
        text=text,
        model_id=ELEVENLABS_MODEL_ID,
    )

    buffer = b""  # Buffer to store audio data
    chunk_size = 8192  # Increase chunk size for smoother playback

    for chunk in audio_stream:  # Iterate over the generator
        buffer += chunk  # Append chunk to buffer

        if len(buffer) >= chunk_size:
            ipd.display(ipd.Audio(buffer, rate=44100, autoplay=True))
            buffer = b""  # Reset buffer
            await asyncio.sleep(0.5)  # Adjust delay for natural playback

    # Play any remaining buffered audio
    if buffer:
        ipd.display(ipd.Audio(buffer, rate=44100, autoplay=True))

    elapsed_time = time.time() - start_time
    print(f"TTS Streaming Time: {elapsed_time:.2f} seconds")"""

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

        # Play the chunk
        ipd.display(ipd.Audio(chunk_data, rate=samplerate, autoplay=True))
        await asyncio.sleep(chunk_duration)

    elapsed_time = time.time() - start_time
    print(f"TTS Streaming Time: {elapsed_time:.2f} seconds")


# Run the process asynchronously
async def main():
    transcribed_text = await transcribe_audio(AUDIO_FILE)
    print("User said:", transcribed_text)
    ai_feedback = await get_ai_feedback(transcribed_text)
    print("AI feedback:", ai_feedback)
    await stream_speech(ai_feedback)  # Stream the feedback audio

# Run the async main function
if __name__ == "__main__":
    asyncio.run(main())