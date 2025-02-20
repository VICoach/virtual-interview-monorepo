from typing import Union, List, Dict, AsyncIterator, Any
from abc import ABC, abstractmethod
from src.config.settings import get_settings
from src.logger.logger import get_logger
from typing import AsyncIterator

logger = get_logger(__file__)
settings = get_settings()


class LLM(ABC):
    def __init__(self, model_name: str, model_provider: str):
        """ 
        Args:
            model_name (str): The name of the model.
            model_provider (str): The provider or company behind the model
        """
        self.model_name = model_name
        self.model_provider = model_provider
        self.client = None

    @abstractmethod
    async def get_response(
        self, messages: List[str], stream: bool, max_token=None
    ) -> Union[str, AsyncIterator[str]]:
        """
        Args:
            messages (list):  A list of messages (conversation history).
            stream (bool):  A boolean flag indicating if the response should be streamed.
            max_token (_type_, optional): max number of tokens in the response. Defaults to None.

        Returns:
            Union[str, AsyncIterator[str]]: The generated response.
        """ 
        pass

    async def get_info(self) -> Dict[str, Any]:
        """
        Abstract method to return info of the LLM model.
        Returns:
            Dict[str, Any]: info.
        """
        return {
            "model_name": self.model_name,
            "model_provider": self.model_provider,
        }