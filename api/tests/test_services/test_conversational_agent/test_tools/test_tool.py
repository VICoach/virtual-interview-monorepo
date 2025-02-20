from src.services.conversational_agent.tools.tool_attributes import InputField, Header, QueryParam, Authentication, SDE
from src.services.conversational_agent.tools.tool import Tool
from unittest.mock import patch, Mock
import requests
import pytest
import yaml

# Mock logger and log_function_call to avoid actual logging during tests
logger_mock = Mock()
log_function_call_mock = lambda logger=None: lambda func: func  # No-op decorator
get_logger_mock = lambda name: logger_mock
get_logger = get_logger_mock
log_function_call = log_function_call_mock

@pytest.fixture
def sample_tool():
    return Tool(
        _id={"id": "123"},
        name="My Test Tool",
        description="This is a test tool.",
        method="GET",
        endpoint_url="https://example.com/api",
        input=[InputField(name="input1", type="string", description="Test input")],
        header=[Header(key="Authorization", value="Bearer token")],
        queryParams=[QueryParam(name="param1", type="integer", example=123, description="Test Param")],
        authentication=Authentication(checked=True, type="bearer", token="test_token"),
        sde=SDE(checked=True, prompt="Test SDE"),
        timeout=5
    )

def test_tool_initialization(sample_tool):
    assert sample_tool.name == "my_test_tool"
    assert sample_tool.description == "This is a test tool."
    assert sample_tool.method == "GET"
    assert sample_tool.endpoint_url == "https://example.com/api"
    assert sample_tool.timeout == 10  # Default timeout if not set in init
    assert sample_tool.actual_header == {"Authorization": "Bearer token"}
    assert sample_tool.input == [InputField(name="input1", type="string", description="Test input")]
    assert sample_tool.queryParams == [QueryParam(name="param1", type="integer", example=123, description="Test Param")]
    assert sample_tool.authentication == Authentication(checked=True, type="bearer", token="test_token")
    assert sample_tool.sde == SDE(checked=True, prompt="Test SDE")



def test_to_snake_case(sample_tool):
    assert sample_tool._to_snake_case("My Test Tool") == "my_test_tool"
    assert sample_tool._to_snake_case("Another  Test") == "another_test"

def test_example_usage(sample_tool):
    expected_usage = """{
    "params": {'param1': 123},
    "payload": {}
}"""
    assert sample_tool.example_usage.strip() == expected_usage.strip()

def test_detailed_description(sample_tool):
    assert "Example Usage:" in sample_tool.detailed_description

@patch("requests.get")
@pytest.mark.asyncio  # Mark the test as asynchronous
async def test_call_success(mock_get, sample_tool):
    mock_response = Mock()
    mock_response.status_code = 200
    mock_response.json.return_value = {"key": "value"}
    mock_get.return_value = mock_response

    result = await sample_tool.call({}, {})  # Await the coroutine
    expected_yaml = yaml.dump({"key": "value"}, default_flow_style=False)
    assert result.strip() == expected_yaml.strip()

@patch("requests.get")
@pytest.mark.asyncio
async def test_call_non_json_response(mock_get, sample_tool):
    mock_response = Mock()
    mock_response.status_code = 200
    mock_response.text = "This is not JSON"
    mock_get.return_value = mock_response

    result = await sample_tool.call({}, {})  # Await the coroutine
    expected_yaml = yaml.dump({"error": "Response is not valid JSON", "response_text": "This is not JSON"})
    assert result.strip() == expected_yaml.strip()

@patch("requests.get")
@pytest.mark.asyncio
async def test_call_error(mock_get, sample_tool):
    mock_get.side_effect = requests.exceptions.RequestException("Test Error")

    result = await sample_tool.call({}, {})  # Await the coroutine
    expected_yaml = yaml.dump({"error": "Test Error"})
    assert result.strip() == expected_yaml.strip()