from src.services.conversational_agent.tools.tool import Tool 
from api import get_settings , get_logger
from typing import Literal, List
from api import yaml_read_file



logger = get_logger(__file__)
settings = get_settings()

# Constants from settings
END_STREAM_PATTERN = settings.END_STREAM_PATTERN
FUNC_CALLING_FORMAT = settings.FUNC_CALLING_FORMAT


class PromptManager():
    data = None 
    def __init__(self , language_lib_dir : str) : 
        if not PromptManager.data : 
            self.data = yaml_read_file(language_lib_dir)
            PromptManager.data = self.data 
        else : 
            self.data = PromptManager.data 

    def get_languages(self):
        try :  
            return list[self.data.keys()]
        except Exception as e : 
            logger.error(f"error occured in returning languages from prompt manager : {e}")
    
    async def acreate_system_prompt(
            self , 
            tools : List[Tool] , 
            base_system_prompt : str ,
            language : Literal["English" , "French" , "Spanish" , "German"],
            knowledge_base_content : str = "" 
        ) -> str:
        """
        Constructs the full system prompt that includes the base system prompt, tool availability, and knowledge base content.

        Returns:
            str: The complete system prompt.
        """
        chat_system_prompt = f"{base_system_prompt} "
        system_prompt_injections = self.data[language]
        if len(tools)  : 
            chat_system_prompt+=system_prompt_injections['tools_prompt_injection'].format(tools = tools , FUNC_CALLING_FORMAT = FUNC_CALLING_FORMAT)
        if knowledge_base_content : 
            chat_system_prompt+=system_prompt_injections['knowledge_base_prompt_injection'].format(knowledge_base_content = knowledge_base_content)
        return chat_system_prompt
    def create_system_prompt(
            self , 
            tools : List[Tool] , 
            base_system_prompt : str ,
            language : Literal["English" , "French" , "Spanish" , "German"] = "English",
            knowledge_base_content : str = "" ,
        ) -> str:
        """
        Constructs the full system prompt that includes the base system prompt, tool availability, and knowledge base content.

        Returns:
            str: The complete system prompt.
        """
        # We need to first build the prompt injection for the transfer call feature and the end call feature from the config 
        chat_system_prompt = f"{base_system_prompt} "
        system_prompt_injections = self.data.get(language)
        if len(tools)  : 
            chat_system_prompt+=system_prompt_injections['tools_prompt_injection'].format(tools = tools , FUNC_CALLING_FORMAT = FUNC_CALLING_FORMAT)
        if knowledge_base_content : 
            chat_system_prompt+=system_prompt_injections['knowledge_base_prompt_injection'].format(knowledge_base_content = knowledge_base_content)
        return chat_system_prompt


