from src.services.conversational_agent.llm_clients import azure_openai_llm
from src.services.conversational_agent.llm_clients.llm import LLM
from typing import Union, List, Dict, AsyncIterator, Any
from src.config.settings import get_settings
from src.logger.logger import get_logger




logger = get_logger(__file__)
settings = get_settings()


class CollectionLLM : 
    llm_collection : Dict[str , LLM ] = {
        #-------AZURE-HOSTED--------#
        "azure-gpt-4o" : azure_openai_llm.AzureOpenAILLM("gpt-4o" , "2024-08-01-preview"),
        "azure-gpt-4o-mini" : azure_openai_llm.AzureOpenAILLM("gpt-4o-mini" ,"2024-08-01-preview"),
    }


