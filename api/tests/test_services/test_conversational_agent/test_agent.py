import pytest
from src.services.conversational_agent.agent import Agent, PromptManager, END_STREAM_PATTERN, FUNC_CALLING_FORMAT, PROMPT_LIB_PATH
from src.services.conversational_agent.tools.tool import Tool

# Assuming you have a sample tool for testing
tool_test = Tool(
    name="weather_tool",
    description="Get the current weather in a given location.",
    method="GET",
    endpoint_url="http://weather_api.com",
    queryParams=[
        {"name": "location", "type": "string", "description": "The city and state, e.g., San Francisco, CA", "example": "Tunis, Tunisia"},
        {"name": "unit", "type": "string", "description": "The unit of temperature, e.g., C or F", "example": "C"}
    ]
)

@pytest.mark.asyncio
async def test_agent_chat_function_call():
    agent = await Agent.create(
        base_system_prompt="You are a helpful AI assistant.",
        model="azure-gpt-4o-mini",
        tools=[tool_test],
        knowledge_base_content="This is some sample knowledge."
    )

    # A chat message that should trigger a function call
    chat_message = {"role": "user", "content": "What is the weather in Tunis?"}

    async for token in agent.chat(chat_message):
        if "{" in token:  # Check if the output contains a function call
            assert True
            return  # Exit the test if a function call is detected

    assert False  # Fail the test if no function call is detected

@pytest.mark.asyncio
async def test_agent_chat_response():
    agent = await Agent.create(
        base_system_prompt="You are a helpful AI assistant.",
        model="azure-gpt-4o-mini",
        tools=[tool_test],
        knowledge_base_content="This is some sample knowledge."
    )

    chat_message = {"role": "user", "content": "Hello"}

    async for token in agent.chat(chat_message):
        if token:  # Check if there is a response
            assert True
            return  # Exit the test if a response is detected

    assert False  # Fail the test if no response is detected