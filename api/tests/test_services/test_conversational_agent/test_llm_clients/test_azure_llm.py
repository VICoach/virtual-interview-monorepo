import pytest
from unittest.mock import patch, AsyncMock, MagicMock
from src.services.conversational_agent.llm_clients.azure_openai_llm import AzureOpenAILLM  # Correct import path
from api import get_settings, get_logger
from typing import List, Dict, Any

settings = get_settings()

# Mock settings and logger
settings_mock = MagicMock()
settings_mock.AZURE_BASE_URL = settings.AZURE_BASE_URL
settings_mock.AZURE_API_KEY = settings.AZURE_API_KEY
get_settings_mock = lambda: settings_mock
get_settings = get_settings_mock

logger_mock = MagicMock()
get_logger_mock = lambda name: logger_mock
get_logger = get_logger_mock


@pytest.mark.asyncio
async def test_get_response_streaming():
    llm = AzureOpenAILLM(model_name="test_model", api_version="test_version")

    messages: List[Dict[str, Any]] = [{"role": "user", "content": "Hello"}]
    mock_response = AsyncMock()
    mock_response.__aiter__.return_value = [
        AsyncMock(choices=[AsyncMock(delta=AsyncMock(content="Hel"))]),
        AsyncMock(choices=[AsyncMock(delta=AsyncMock(content="lo"))]),
        AsyncMock(choices=[AsyncMock(delta=AsyncMock(content=None))]), # test for empty delta.content
        AsyncMock(choices=[AsyncMock(delta=AsyncMock(content="!"))]),
    ]

    llm.client.chat.completions.create = AsyncMock(return_value=mock_response)

    result = [chunk async for chunk in llm.get_response(messages=messages)]

    assert result == ['Hel', '', 'lo', '', '', '!', '']
    llm.client.chat.completions.create.assert_called_once_with(
        messages=messages, model="test_model", stream=True, max_tokens=None
    )


@pytest.mark.asyncio
async def test_get_response_non_streaming():
    llm = AzureOpenAILLM(model_name="test_model", api_version="test_version")
    messages: List[Dict[str, Any]] = [{"role": "user", "content": "Hello"}]

    mock_response = AsyncMock(choices=[AsyncMock(message=AsyncMock(content="Hello!"))])
    llm.client.chat.completions.create = AsyncMock(return_value=mock_response)

    result = [chunk async for chunk in llm.get_response(messages=messages, stream=False)]

    assert result == ["Hello!"]
    llm.client.chat.completions.create.assert_called_once_with(
        messages=messages, model="test_model", stream=False, max_tokens=None
    )


