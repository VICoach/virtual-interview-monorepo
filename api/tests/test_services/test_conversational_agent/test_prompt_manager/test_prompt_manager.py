import pytest
from unittest.mock import patch, Mock
from src.services.conversational_agent.prompt_manager.prompt_manager import (
    PromptManager,
    END_STREAM_PATTERN,
    FUNC_CALLING_FORMAT
)
from src.services.conversational_agent.tools.tool import Tool
import os 
# Mock settings and logger
settings_mock = Mock()
settings_mock.END_STREAM_PATTERN = END_STREAM_PATTERN
settings_mock.FUNC_CALLING_FORMAT = FUNC_CALLING_FORMAT
get_settings_mock = lambda: settings_mock
get_settings = get_settings_mock

logger_mock = Mock()
get_logger_mock = lambda name: logger_mock
get_logger = get_logger_mock

@pytest.fixture
def language_lib_dir():
    return os.path.join("api","services","conversational_agent","prompt_manager","system_prompt_lib.yml")  

@pytest.fixture
def sample_data():
    return {
        "English": {
            "tools_prompt_injection": "Available Tools: {tools}.\nTo call a tool, your output must strictly follow this format: {FUNC_CALLING_FORMAT}.\nOnly use the tools that are available to you.\nWhen you are asked a question that requires a chain tool usages you can call your tools one by one, use the function calling format for the first tool, once you get your response use the function calling format again to answer the second question, so on and so forth. \nFor example your output can look like this: \nto answer 'question1' I need to use the toolx {FUNC_CALLING_FORMAT}\nnow that I have the answer to question 1 I will use tooly {FUNC_CALLING_FORMAT}...\ndon't use ticks, Don't output ```json {FUNC_CALLING_FORMAT}``` instead just output {FUNC_CALLING_FORMAT}\n",
            "knowledge_base_prompt_injection": "Knowledge Base Content: {knowledge_base_content}\n\nUse the above information to answer user queries accurately.\n",
            "proper_tool_use_injection": "Before using any tool, explain why you think it is necessary and how you are going to use it.\nEnsure your responses are scientific, clear, and directly address the user's needs.\nIf you are asked a question that you do not know the answer to, or do not have the tool to answer, tell the user that you simply don't know the answer yet. Also don't use ticks or code blocks between ticks.\n"
        }
    }



@pytest.mark.asyncio
@patch("src.services.utils.yaml_read_file")  # Updated patch target
async def test_create_system_prompt_no_tools_no_knowledge_base(mock_yaml_read_file, language_lib_dir, sample_data):
    mock_yaml_read_file.return_value = sample_data
    prompt_manager = PromptManager(language_lib_dir)
    tools = []
    base_system_prompt = "Base prompt"
    expected_prompt = f"{base_system_prompt} "
    result = await prompt_manager.acreate_system_prompt(tools, base_system_prompt, "English")
    assert result == expected_prompt

@pytest.mark.asyncio
@patch("src.services.utils.yaml_read_file")  # Updated patch target
async def test_create_system_prompt_invalid_language(mock_yaml_read_file, language_lib_dir, sample_data):
    mock_yaml_read_file.return_value = sample_data
    prompt_manager = PromptManager(language_lib_dir)
    tools = [Tool(name="tool1", description="test tool", endpoint_url="test")]
    base_system_prompt = "Base prompt"
    with pytest.raises(KeyError):
        await prompt_manager.acreate_system_prompt(tools, base_system_prompt, "InvalidLanguage")