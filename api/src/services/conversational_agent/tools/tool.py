from src.services.conversational_agent.tools.tool_attributes import InputField , Header , QueryParam , Authentication , SDE 
from typing import List, Dict, Any, Literal, Optional
from pydantic import BaseModel, Field , ConfigDict
from api import  get_logger, log_function_call
import unicodedata
import requests
import yaml
import re 

logger = get_logger(__file__)


class Tool(BaseModel):
    _id: Optional[Dict[str, str]] 
    name: str
    description: str
    method: str = "GET"
    endpoint_url: str
    input: Optional[List[InputField]] = Field(default= [])
    header: Optional[List[Header]] = Field(default=[])
    queryParams:Optional[List[QueryParam]]  = Field(default=[])
    authentication: Optional[Authentication] = Field(default=None)
    sde: Optional[SDE] = Field(default=None)
    timeout: Optional[int] = 10
    actual_header: Optional[Any] = Field(default= {})
    execution_type : Optional[Literal["synchronous" , "asynchronous"]] = Field(default = "synchronous")
    model_config = ConfigDict(extra="ignore")

    def __init__(self, **data):
        super().__init__(**data)
        self.name = self._to_snake_case(self.name)
        self.actual_header = {header.key: header.value for header in self.header}
        self.timeout = 10
    def _to_snake_case(self, text):
        text = unicodedata.normalize('NFD', text).encode('ascii', 'ignore').decode("utf-8")
        text = text.lower()
        text = re.sub(r'\W+', '_', text)
        return text.strip('_')
    
    def __str__(self):
        return f"Tool(cname={self.name}, description={self.detailed_description})"

    @property
    def example_usage(self) -> str:
        """
        Generates an example usage string based on the tool's name, input, and query parameters.
        """
        example_params = {param.name: param.example or "example_value" for param in self.queryParams}
        
        example_usage = (
            "{\n"
            f"    \"params\": {example_params},\n"
            "    \"payload\": {}\n"
            "}"
        )
        return example_usage

    @property
    def detailed_description(self) -> str:
        """
        Appends the example usage to the tool's description.
        """
        return f"{self.description}\n\nExample Usage:\n{self.example_usage}"

    @log_function_call(logger=logger)
    async def call(self, params: Dict[str, Any], payload: Dict[str, Any]) -> str:
        """
        Calls the API endpoint with the given parameters and payload based on the provided configuration.
        """
        response_methods = {
            "GET": requests.get,
            "POST": requests.post,
            "PUT": requests.put,
            "DELETE": requests.delete
        }
        try:
            response = response_methods[self.method.upper()](
                self.endpoint_url,
                headers=self.actual_header,
                params=params,
                json=payload if self.method.upper() in {"POST", "PUT"} else None,
                timeout=self.timeout
            )

            response.raise_for_status()  # Ensure we handle non-200 responses

            # Check if response has JSON content before attempting to parse
            try:
                response_data = response.json()
                response_yaml = yaml.dump(response_data, default_flow_style=False)
                return response_yaml
            except ValueError:
                return yaml.dump({"error": "Response is not valid JSON", "response_text": response.text})

        except requests.exceptions.RequestException as e:
            logger.warning(f"Error calling {self.name}: {e}")
            return yaml.dump({"error": str(e)})