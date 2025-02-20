from api.services.conversational_agent.tools.response_processor import ResponseProcessor   
from api.services.conversational_agent.tools.tool import Tool
from api import get_settings , get_logger
from typing import List, Optional, Dict

# Initialize settings and logger
settings = get_settings()
logger = get_logger(__file__)



class ToolManager:
    """
    Manages the execution of tools and retrieval of knowledge base information. Handles both synchronous
    and asynchronous tool calls, as well as function call parsing from the LLM responses.

    Attributes:
        tools (Dict[str, Tool]): A dictionary of tool instances keyed by their name.
    """

    def __init__(self, tools: List[Tool] = []):
        """
        Initializes the ToolManager with the provided tools and project ID.

        Args:
            tools (List[Tool]): A list of Tool instances that the manager will handle.
        """
        self.tools = {tool.name: tool for tool in tools}



    async def execute_function(self, llm_response: str) -> Optional[Dict[str, str]]:
        """
        Calls the appropriate tool based on the response from the LLM, handling sync tool execution.

        Args:
            llm_response (str): The LLM response which might contain a function call.

        Returns:
            Optional[Dict[str, str]]: The result of the tool call if a tool was executed, otherwise None.
        """
        try:
            if "function_name" in llm_response:
                function_call= await ResponseProcessor.pre_process_function_calls(llm_response)
                func_name = function_call.get("function_name")
                params = function_call.get("params", {})
                payload = function_call.get("payload", {})
                logger.debug(f"function_call in toolmanager.execute_function : {function_call}")
                
                
                # Handle other tool calls
                tool = self.tools[func_name]
                if tool:
                    if tool.execution_type == "synchronous":
                        result = await tool.call(params=params, payload=payload)
                        return {"role": "system", "content": f"Result of {func_name}:\n\n{result}\n"}
            return None
        except Exception as e:
            logger.error(f"Error occurred in execute_function: {e}")
            return {"role": "system", "content": f"Error occurred: {e}"}
