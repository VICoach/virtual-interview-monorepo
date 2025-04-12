The main purpose of this folder is to receive an audio input from the user and provide an audio response from the interviewer.

# Steps

- Receive the audio file.
- Save it temporarily.
- Transcribe it to text using Speech-to-Text (STT).
- Send the transcribed text to the agent via WebSocket.
- Receive the AI agent’s response.
- Convert the response into speech (TTS).
- Streams the audio back to the client through the same WebSocket.
