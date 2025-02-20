from src.services.conversational_agent.tools.tool import Tool 
from pydantic import BaseModel, Field
from typing import List , Optional 
from src import get_logger

logger = get_logger(__file__)



class CreateAgentRequest(BaseModel):
    """
    Model representing the parameters required to create an agent request. It includes the 
    system prompt, an optional welcome message, the model to use, and additional context 
    such as knowledge base content, project ID, and client information. Also, it configures 
    call features like end call or transfer call functionalities.
    
    Attributes:
        system_prompt (str): The main system prompt for the agent..
        model (str): The language model to use for the agent.
        knowledge_base_content (Optional[str]): Additional knowledge base content provided for agent responses.
        tools (Optional[List[Tool]]): List of tools available for the agent to use.
        language (str): The language in which the agent will interact. Defaults to English.
    """
    system_prompt: str 
    model: str
    knowledge_base_content :Optional[str] = Field( default=None)
    tools: Optional[List[Tool]] = Field(default=[])
    language : str = Field(default = "English" )



