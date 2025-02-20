from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from src.schemas.schema_llm_chat  import CreateAgentRequest 
from src.services.conversational_agent.agent import Agent
from src.config.settings import get_settings
from src.logger.logger import get_logger
import json



logger = get_logger(__file__)
settings = get_settings()
router = APIRouter()

END_STREAM_PATTERN = settings.END_STREAM_PATTERN


@router.websocket("/chat")
async def websocket_chat(websocket: WebSocket):
    await websocket.accept()

    agent = None

    try:
        data = await websocket.receive_text()
        create_agent_request = CreateAgentRequest(**json.loads(data))

        agent = await  Agent.create(
            base_system_prompt=create_agent_request.system_prompt,
            model=create_agent_request.model,
            tools=create_agent_request.tools,
            knowledge_base_content=create_agent_request.knowledge_base_content,
            language = create_agent_request.language ,
        )


        await websocket.send_text(json.dumps({"status": "Agent created successfully"}))
        while True:
            try:
                data = json.loads(await websocket.receive_text())
                message = data.get("message", "")

                if message == "/bye":
                    await websocket.send_text(END_STREAM_PATTERN)
                    break

                chat_message = {"role": "user", "content": message}
                
                response_message = ""
                async for chunk in agent.chat(chat_message):
                    if chunk:
                        response_message += chunk
                        await websocket.send_text(chunk)
                
                
                await websocket.send_text(END_STREAM_PATTERN)


            except WebSocketDisconnect:
                logger.info("Client disconnected")
                break
            except Exception as e:
                logger.error(f"Error during WebSocket communication: {e}")
                await websocket.send_text(json.dumps({"error": str(e)}))
    except Exception as e:
        await websocket.send_text(json.dumps({"error": str(e)}))
        logger.error(f"Exception during agent setup: {e}")
    