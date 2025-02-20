import asyncio
import websockets
import json
import time

# WebSocket server URL
websocket_url = "ws://localhost:8002/chat"

# Technical Interviewer Agent System Prompt
system_prompt = """
You are a technical interviewer specializing in software engineering and algorithmic problem-solving. 
Your job is to conduct a coding interview as follows:
1. Give the user a programming problem with specific **time and space complexity constraints**.
2. Ask the user to **explain their approach** before coding.
3. **Evaluate the approach** and verify if it meets the constraints. If not, ask the user to optimize it.
4. Once the user provides a valid approach, ask them to **submit the actual code**.
5. **Review the code**, checking correctness, efficiency, and readability.
6. Provide **detailed feedback** and suggest improvements.
7. Finally, generate a **short report** summarizing the interview and the user's performance.

You must be **structured, professional, and engaging**, encouraging the user to think critically. Keep responses concise but informative.
"""

# LLM Model Collection
llm_collection = {
    "azure-gpt-4o": "azure-gpt-4o",
}

async def chat_with_llm(model, model_name):
    try:
        async with websockets.connect(
            websocket_url ,
            ping_interval=3600,  # interval between pings
            ping_timeout=3600 
        ) as websocket:
            create_agent_request = {
                "system_prompt": system_prompt,
                "model": model,
                "tools": [],  # No external APIs needed for the interview process
            }
            await websocket.send(json.dumps(create_agent_request))
            response = await websocket.recv()
            print(f"{model_name} - server-response: {response}")

            while True:
                message = input(f"{model_name} - Enter your message (or type 'exit'): ")
                if 'exit' in message.lower():
                    break

                print(f"{model_name} - Sending message: {message}")
                await websocket.send(json.dumps({"message": message}))

                full_response = []
                print(f"{model_name} - Complete server response: ", end="")
                while True:
                    response = await websocket.recv()
                    full_response.append(response)
                    print(response, end="")
                    if response == "__end_of_response__":
                        complete_response = ''.join(full_response[:-1])
                        print()
                        break

            await websocket.close()  # Close the connection gracefully

    except Exception as e:
        print(f"An error occurred with {model_name}: {e}")

async def run_chat():
    for model_name, model in llm_collection.items():
        print(f"Starting chat with model: {model_name}")
        await chat_with_llm(model, model_name)
        print(f"Chat with {model_name} finished.\n")  # Add a separator

asyncio.run(run_chat())
