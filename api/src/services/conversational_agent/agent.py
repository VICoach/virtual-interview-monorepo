from src.services.conversational_agent.prompt_manager.prompt_manager import PromptManager
from src.services.conversational_agent.tools.tool_manager import ToolManager
from src.services.conversational_agent.chat.chat_manager import ChatManager
from src.services.conversational_agent.tools.tool import Tool
from typing import List, Dict, Union , AsyncIterator
from src.config.settings import get_settings
from src.logger.logger import get_logger
import os 

logger = get_logger(__file__)
settings = get_settings()

# Constants from settings
END_STREAM_PATTERN = settings.END_STREAM_PATTERN
FUNC_CALLING_FORMAT = settings.FUNC_CALLING_FORMAT
PROMPT_LIB_PATH = os.path.join("src","services","conversational_agent","prompt_manager","system_prompt_lib.yml")
PROMPT_MANAGER = PromptManager(PROMPT_LIB_PATH)

class Agent:
    """
    The `Agent` class represents a virtual assistant that handles conversations using the provided tools and knowledge base.
    It manages interactions via chat and tool executions, including both synchronous and asynchronous tasks.

    Attributes:
        knowledge_base_content (str): Content used to assist in responding to queries.
        base_system_prompt (str): The base system prompt used to initialize the assistant.
        tools (Dict[str, Tool]): Dictionary of available tools for the agent to use.
        system_prompt (str): The complete system prompt that includes tool availability and other instructions.
        tool_manager (ToolManager): Manages the tools available to the agent.
        chat_manager (ChatManager): Handles chat interactions with the user.
    """

    def __init__(
            self, 
            base_system_prompt: str, 
            model: str, 
            tools: List[Tool] , 
            knowledge_base_content: str = None, 
            language : str = "English" , 
        ):
        """
        Initializes an `Agent` instance.

        Args:
            welcome_message (str): The welcome message from the assistant.
            base_system_prompt (str): The base prompt that outlines the system's role and behavior.
            model (str): The language model to be used by the assistant.
            knowledge_base_content (str): Knowledge content to assist in responding to customer queries.
            tools (List[Tool]): List of tools available to the agent for performing various actions.
        """
        self.knowledge_base_content = knowledge_base_content
        self.base_system_prompt = base_system_prompt
        self.tools = {tool.name: tool for tool in tools}
        self.system_prompt = PROMPT_MANAGER.create_system_prompt(
            tools=tools ,
            knowledge_base_content=knowledge_base_content , 
            base_system_prompt=base_system_prompt , 
            language=language
        )

        # Initialize the ToolManager and ChatManager
        self.tool_manager = ToolManager(tools)
        self.chat_manager = ChatManager(self.system_prompt, model=model )
        

    @classmethod
    async def create(
        cls, 
        base_system_prompt: str, 
        model: str, 
        knowledge_base_content: str = None , 
        tools: List[Tool] = [] , 
        language : str  = "English", 
        ) -> "Agent" :
        """
        Asynchronously creates and returns an instance of the `Agent` class.

        Args:
            base_system_prompt (str): The base prompt for initializing the agent.
            model (str): The model the agent will use for chat interactions.
            knowledge_base_content (str): Content from the knowledge base for assistance.
            tools (List[Tool]): List of tools available to the agent.
        Returns:
            Agent: An instance of the `Agent` class.
        """
        agent = cls(
            base_system_prompt=base_system_prompt,
            model=model,
            knowledge_base_content=knowledge_base_content,
            tools=tools , 
            language = language ,
        )
        return agent

    async def chat(self, chat_message: Dict[str, str]) -> AsyncIterator[Union[str, None]]:
        """
        Processes a chat message from the user, handles tool invocation, and yields responses token-by-token.

        Args:
            chat_message (Dict[str, str]): The message from the user.

        Yields:
            str: The tokenized response from the assistant.
        """
        try :
            async for token in self.chat_manager.chat(chat_message, self.tool_manager):
                yield token
        except Exception as e : 
            logger.error(f"Error occured in Agent.chat : {e}")
    