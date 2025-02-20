from api.services.conversational_agent.llm_clients.llm import LLM 
from typing import Union, List, Dict, AsyncIterator, Any
from api.services.utils import exponential_backoff
from api import get_settings , get_logger
from openai import  AsyncAzureOpenAI 
from typing import AsyncIterator


logger = get_logger(__file__)
settings = get_settings()

class AzureOpenAILLM(LLM):
    def __init__(self, model_name: str , api_version : str , model_provider : str = "azure"):
        self.model_name = model_name
        self.model_provider = model_provider
        self.client = AsyncAzureOpenAI(
            azure_endpoint=settings.AZURE_BASE_URL,
            api_key=settings.AZURE_API_KEY,
            api_version=api_version
        )
        
    @exponential_backoff(retries=10, backoff_in_seconds=2, max_backoff=16)
    async def get_response(
        self,
        messages: List[Dict[str, Any]], 
        stream: bool = True , 
        max_tokens: int = None
    ) -> Union[str, AsyncIterator[str]]:

        response = await self.client.chat.completions.create(
            messages=messages,
            model=self.model_name,
            stream=stream,
            max_tokens=max_tokens
        )
        if stream:
            async for token in response:
                if token and len(token.choices) and token.choices[0].delta.content:
                    yield token.choices[0].delta.content
                yield ""
        else:
            yield response.choices[0].message.content
