from src.services.conversational_agent.tools.response_processor import ResponseProcessor  
from unittest.mock import Mock
import pytest

# Mock settings and logger
settings_mock = Mock()
get_settings_mock = lambda: settings_mock
get_settings = get_settings_mock

logger_mock = Mock()
get_logger_mock = lambda name: logger_mock
get_logger = get_logger_mock

@pytest.mark.asyncio
async def test_post_process_function_calls():
    function_call_dict = {"tool_name": "my_tool", "arguments": {"arg1": "value1"}}
    expected_json = '{"tool_name": "my_tool", "arguments": {"arg1": "value1"}}'
    result = await ResponseProcessor.post_process_function_calls(function_call_dict)
    assert result == expected_json

@pytest.mark.asyncio
async def test_pre_process_function_calls_valid_json():
    message = '{"tool_name": "my_tool", "arguments": {"arg1": "value1"}}'
    expected_dict = {"tool_name": "my_tool", "arguments": {"arg1": "value1"}}
    result = await ResponseProcessor.pre_process_function_calls(message)
    assert result == expected_dict

@pytest.mark.asyncio
async def test_pre_process_function_calls_with_comments():
    message = """
    {
        // This is a comment
        "tool_name": "my_tool", /* Another comment */
        "arguments": {
            "arg1": "value1" // Inline comment
        }
    }
    """
    expected_dict = {"tool_name": "my_tool", "arguments": {"arg1": "value1"}}
    result = await ResponseProcessor.pre_process_function_calls(message)
    assert result == expected_dict

@pytest.mark.asyncio
async def test_pre_process_function_calls_with_python_literals():
    message = "{'tool_name': 'my_tool', 'arguments': {'arg1': True, 'arg2': False, 'arg3': None}}"
    expected_dict = {"tool_name": "my_tool", "arguments": {"arg1": True, "arg2": False, "arg3": None}}
    result = await ResponseProcessor.pre_process_function_calls(message)
    assert result == expected_dict


@pytest.mark.asyncio
async def test_pre_process_function_calls_invalid_json():
    message = '{"tool_name": "my_tool", "arguments": {"arg1": "value1"'  # Missing closing brace
    result = await ResponseProcessor.pre_process_function_calls(message)
    assert result is None

@pytest.mark.asyncio
async def test_pre_process_function_calls_empty_message():
    message = ""
    result = await ResponseProcessor.pre_process_function_calls(message)
    assert result is None

@pytest.mark.asyncio
async def test_pre_process_function_calls_no_json():
    message = "This is not json"
    result = await ResponseProcessor.pre_process_function_calls(message)
    assert result is None

@pytest.mark.asyncio
async def test_pre_process_function_calls_with_single_quotes():
    message = "{'tool_name': 'my_tool', 'arguments': {'arg1': 'value1'}}"
    expected_dict = {"tool_name": "my_tool", "arguments": {"arg1": "value1"}}
    result = await ResponseProcessor.pre_process_function_calls(message)
    assert result == expected_dict

@pytest.mark.asyncio
async def test_pre_process_function_calls_with_backslash():
    message = '{"tool_name": "my_tool", "arguments": {"arg1": "val\\ue1"}}'
    expected_dict = {"tool_name": "my_tool", "arguments": {"arg1": "value1"}}
    result = await ResponseProcessor.pre_process_function_calls(message)
    assert result == expected_dict

@pytest.mark.asyncio
async def test_pre_process_function_calls_with_backslash_and_single_quotes():
    message = "{'tool_name': 'my_tool', 'arguments': {'arg1': 'val\\ue1'}}"
    expected_dict = {"tool_name": "my_tool", "arguments": {"arg1": "value1"}}
    result = await ResponseProcessor.pre_process_function_calls(message)
    assert result == expected_dict