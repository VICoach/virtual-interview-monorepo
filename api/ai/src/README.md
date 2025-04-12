The main purpose of this folder is to receive an audio input from the user and provide an audio response from the interviewer.

# Steps

- Receive the audio file.
- Save it temporarily.
- Run STT (Speech-to-Text) on it.
- Send the transcribed text to the agent via WebSocket.
- Receive the AI response.
- Convert the response into speech (TTS).
- Return both the text response and (optionally) a path to the audio file.

# Routes in Use

## 1. /interview/ (POST route)

**Role :**

This route handles the process of accepting an audio file (MP3 format), transcribing it to text using the transcribe_audio function, sending the transcribed text to the AI agent for a response, and returning a streamed TTS (Text-to-Speech) audio of the AI's reply.

## 2. /ws (WebSocket route)

**Role:**

This route is a WebSocket server that handles bidirectional communication between a client and an agent WebSocket. It listens for messages from the client, forwards them to the agent, and sends the agent’s response back to the client. 
It facilitates live communication between the user and the agent without the need for multiple HTTP requests.

