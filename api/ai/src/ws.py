import asyncio
import websockets

async def client():
    async with websockets.connect(
        "ws://localhost:8765",
        ping_interval=3600,  
        ping_timeout=3600
        ) as websocket:
        response = await websocket.recv()
        print(f"Interviewer: {response}")
        while True:
            user_input = input("You: ")
            await websocket.send(user_input)
            response = await websocket.recv()
            print(f"Interviewer: {response}")

asyncio.run(client())