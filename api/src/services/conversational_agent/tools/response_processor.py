from typing import Dict, Union
from api import  get_settings , get_logger
import json
import re 

# Initialize settings and logger
settings = get_settings()
logger = get_logger(__file__)


class ResponseProcessor():
    @staticmethod
    async def post_process_function_calls(function_call_dict: Dict) -> str:
        json_string = json.dumps(function_call_dict, ensure_ascii=False)
        return json_string

    @staticmethod
    async def pre_process_function_calls(function_calling_message: str) -> Dict[str, Union[str, Dict]]:
        cleaned_message = function_calling_message.replace('\\', '')
        
        # Remove comments from the JSON-like string
        # This regex removes both inline comments (// ...) and block comments (/* ... */)
        comment_pattern = re.compile(r"(\/\/.*?$|\/\*.*?\*\/)", re.MULTILINE | re.DOTALL)
        cleaned_message = re.sub(comment_pattern, '', cleaned_message)
        
        start_idx = cleaned_message.find('{')
        end_idx = cleaned_message.rfind('}')
        
        try:
            if start_idx != -1 and end_idx != -1 and start_idx < end_idx:
                # Extract the JSON-like string part
                json_str = cleaned_message[start_idx:end_idx + 1]

                inside_quotes = False
                processed_str = []
                for char in json_str:
                    if char == '"':  
                        inside_quotes = not inside_quotes
                    if char == "'" and not inside_quotes:
                        processed_str.append('"')
                    else:
                        processed_str.append(char)
                
                processed_json_str = ''.join(processed_str)
                # Replace Python-specific literals with JSON-compatible ones
                processed_json_str = processed_json_str.replace('True', 'true').replace('False', 'false').replace('None', 'null')

                logger.debug(f"processed_json_str @ tool_manager.preprocess_function_calls : {processed_json_str}")
                
                # Attempt to load the processed string as JSON
                try:
                    func_call = json.loads(processed_json_str)
                    return func_call 
                except json.JSONDecodeError as json_err:
                    logger.error(f"JSONDecodeError: {json_err}. Problem with JSON string: {processed_json_str}")
                    raise  # Re-raise after logging for better error visibility
                        
        except Exception as e:
            logger.error(f"Error: {e}. Raw input causing the issue: {cleaned_message[start_idx:end_idx + 1]}")
            raise  # Re-raise the exception to make sure it surfaces
