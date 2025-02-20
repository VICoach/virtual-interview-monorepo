import pytest
from unittest.mock import patch, Mock, AsyncMock
from src.services.conversational_agent.tools.tool_manager import ToolManager
from src.services.conversational_agent.tools.tool import Tool
from src.services.conversational_agent.tools.response_processor import ResponseProcessor
from api import get_settings, get_logger
import json

# Mock settings and logger
settings_mock = Mock()
get_settings_mock = lambda: settings_mock
get_settings = get_settings_mock

logger_mock = Mock()
get_logger_mock = lambda name: logger_mock
get_logger = get_logger_mock

# Mock the ResponseProcessor
@patch("api.services.conversational_agent.tools.tool_manager.ResponseProcessor")
@pytest.mark.asyncio
async def test_execute_function_sync_tool(mock_response_processor):
    # Setup
    tool = Tool(name="my_tool", description="test tool", endpoint_url="test", method="GET", execution_type="synchronous")
    tool_manager = ToolManager(tools = [tool])

    llm_response = '{"function_name": "my_tool", "params": {"arg1": "val1"}, "payload": {}}'
    mock_response_processor.pre_process_function_calls = AsyncMock(return_value={"function_name": "my_tool", "params": {"arg1": "val1"}, "payload": {}})


    # Execution
    result = await tool_manager.execute_function(llm_response)

    # Assertion
    expected_result = {'role': 'system', 'content': "Result of my_tool:\n\nerror: 'Invalid URL ''test'': No scheme supplied. Perhaps you meant https://test?'\n\n"}
    assert result == expected_result


@patch("api.services.conversational_agent.tools.tool_manager.ResponseProcessor")
@pytest.mark.asyncio
async def test_execute_function_missing_tool(mock_response_processor):
    tool_manager = ToolManager()  # Provide an empty list of tools

    llm_response = '{"function_name": "missing_tool", "params": {}, "payload": {}}'
    mock_response_processor.pre_process_function_calls = AsyncMock(return_value={"function_name": "missing_tool", "params": {}, "payload": {}})

    result = await tool_manager.execute_function(llm_response)

    assert result =={'content': "Error occurred: 'missing_tool'", 'role': 'system'}


@patch("api.services.conversational_agent.tools.tool_manager.ResponseProcessor")
@pytest.mark.asyncio
async def test_execute_function_error(mock_response_processor):
    tool = Tool(name="error_tool", description="test tool", endpoint_url="test", method="GET", execution_type="synchronous")
    tool_manager = ToolManager([tool])

    llm_response = '{"function_name": "error_tool", "params": {}, "payload": {}}'
    mock_response_processor.pre_process_function_calls = AsyncMock(return_value={"function_name": "error_tool", "params": {}, "payload": {}})


    result = await tool_manager.execute_function(llm_response)

    expected_result = {'role': 'system', 'content': "Result of error_tool:\n\nerror: 'Invalid URL ''test'': No scheme supplied. Perhaps you meant https://test?'\n\n"}
    assert result == expected_result

@patch("api.services.conversational_agent.tools.tool_manager.ResponseProcessor")
@pytest.mark.asyncio
async def test_execute_function_no_function_name(mock_response_processor):
    tool_manager = ToolManager()  # Provide an empty list of tools

    llm_response = '{"params": {}, "payload": {}}' # No function name
    mock_response_processor.pre_process_function_calls = AsyncMock(return_value=None)


    result = await tool_manager.execute_function(llm_response)

    assert result is None

@patch("api.services.conversational_agent.tools.tool_manager.ResponseProcessor")
@pytest.mark.asyncio
async def test_execute_function_invalid_json(mock_response_processor):
    tool_manager = ToolManager()  # Provide an empty list of tools

    llm_response = '{"function_name": "missing_tool", "params": {}, "payload": ' # Invalid JSON
    mock_response_processor.pre_process_function_calls.side_effect = json.JSONDecodeError("Invalid JSON", "doc", 1) # Correctly initialize JSONDecodeError

    result = await tool_manager.execute_function(llm_response)
    assert result ==  {'role': 'system', 'content': 'Error occurred: Invalid JSON: line 1 column 2 (char 1)'}