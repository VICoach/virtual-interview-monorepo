import os
import json
from functools import lru_cache
from pydantic_settings import BaseSettings
from pydantic import ConfigDict

from typing import Literal

class Settings(BaseSettings):
    """
    Settings class for this application.
    Utilizes the BaseSettings from pydantic for environment variables.
    """

     # The environment variable to determine the environment of the application
    ENVIRONMENT: Literal["local", "dev", "prod"]
    
    # Azure Credentials for the Azure AI Lab API
    AZURE_BASE_URL: str = None
    AZURE_API_KEY: str = None
    
    # The pattern to indicate the end of a response stream for the websocket communication
    END_STREAM_PATTERN: str = "__end_of_response__"
    
    # The format with which the LLM can call a function such as retrieve knowledge - extract x-ray events...
    FUNC_CALLING_FORMAT: str = """{
        "function_name": "here you put the name of the function to call", 
        "params": "A dictionary of query arguments for the function call",
    }"""
    
    PING_PONG_INTERVAL : int = 3600
    
    model_config = ConfigDict(extra="ignore" , env_file = ".env")
        


@lru_cache(maxsize=None)
def get_settings() -> Settings:
    """Function to get and cache settings.
    The settings are cached to avoid repeated disk I/O."""
    environment = os.getenv("ENVIRONMENT", "local")
    
    if environment == "local":
        settings_file = ".env"
    elif environment == "dev":
        settings_file = ".env.dev"
    elif environment == "prod":
        settings_file = ".env.prod"
    else:
        raise ValueError(f"Invalid environment: {environment}")

    # Load settings from the respective .env file
    return Settings(_env_file=settings_file)  # type: ignore