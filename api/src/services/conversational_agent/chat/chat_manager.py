from src.services.conversational_agent.llm_clients.llm_collection import CollectionLLM
from src.services.conversational_agent.tools.tool_manager import ToolManager
from typing import AsyncIterator, Dict, List
from src import get_settings , get_logger

logger = get_logger(__file__)
settings = get_settings()

END_STREAM_PATTERN = settings.END_STREAM_PATTERN
FUNC_CALLING_FORMAT = settings.FUNC_CALLING_FORMAT


class ChatManager:
    """
    Manages chat interactions between the user and the language model, handling knowledge retrieval, function calling, and tool management.

    Attributes:
        system_prompt (str): The initial system prompt for the conversation.
        _chat (List[Dict[str, str]]): A list that stores the chat messages exchanged between the user and assistant.
        llm (CollectionLLM): The language model being used for responses.
    """

    def __init__(self, system_prompt: str, model: str , recursive_call_count_limit : int = 20):
        """
        Initializes a ChatManager instance with the given system prompt, model, and knowledge base content.

        Args:
            system_prompt (str): The system's prompt or message that sets the context for the conversation.
            model (str): The identifier for the language model to use.
            recursive_call_count_limit (int): The maximum number of recursive function calls allowed. Defaults to 5.
        """
        self.system_prompt = system_prompt
        self.recursive_call_count_limit = recursive_call_count_limit
        self._chat: List[Dict[str, str]] = [{"role": "system", "content": self.system_prompt}]
        try : 
            self.llm = CollectionLLM.llm_collection[model]
        except Exception as e : 
            logger.error(f"Model {model} does not exist in llm collection : {e}")
            self.llm = CollectionLLM.llm_collection["azure-gpt-4o-mini"]

    async def chat(self, chat_message: Dict[str, str], tool_manager: ToolManager , recursive_depth : int = 0 ) -> AsyncIterator[str]:
        """
        Handles a chat interaction, managing responses, function calls, and tool invocation.

        Args:
            chat_message (Dict[str, str]): The user message in the chat.
            tool_manager (ToolManager): The ToolManager instance for managing tool calls and responses.
            recursive_depth (int): The current depth of recursive function calls. Defaults to 0.

        Yields:
            str: The generated response tokens from the language model.

        Raises:
            Exception: If any error occurs during the chat process.
        """
        if recursive_depth > self.recursive_call_count_limit:
            logger.error(f"Recursive function call limit reached: {self.recursive_call_count_limit}")
            yield {"role": "system", "content": "Recursive function call limit reached. Ask user for help"}
        try:
            # Append the user message to the chat history
            self._chat.append(chat_message)
            messages = self._chat

            # Get the response stream from the language model
            response = self.llm.get_response(messages=messages, stream=True)
            response_content = ""
            function_call = False

            # Process the tokens from the language model
            async for token in response:
                if "{" in token:
                    function_call = True
                if token and not function_call:
                    response_content += token
                    yield token
                elif token and function_call:
                    response_content += token
                    yield token
            # Append the assistant's response to the chat history
            self._chat.append({"role": "assistant", "content": response_content})
            logger.debug(f"ChatManager.chat response content : {response_content}")
            if function_call : 
                func_output = await tool_manager.execute_function(response_content)
                logger.debug(f"func_output in chatmanager.chat : {func_output}")
                if not func_output is None  :
                    async for token in self.chat(func_output, tool_manager , recursive_depth=recursive_depth+1):
                        yield token
        except Exception as e:
            logger.error(f"Error occurred in chat_manager.chat: {e}")
