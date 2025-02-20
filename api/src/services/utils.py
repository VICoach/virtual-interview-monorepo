from typing import Callable
import time
import functools
import yaml
from typing import Dict 
def exponential_backoff(retries: int = 5, backoff_in_seconds: int = 1, max_backoff: int = 32):
    """
    A decorator to add exponential backoff to a function in case of exceptions.
    
    Args:
        retries (int): Maximum number of retries before giving up.
        backoff_in_seconds (int): Initial backoff duration in seconds.
        max_backoff (int): Maximum allowed backoff time in seconds.
    """
    def decorator(func: Callable):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            attempt = 0
            backoff = backoff_in_seconds
            while attempt < retries:
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    attempt += 1
                    if attempt == retries:
                        raise e  # Raise the exception if max retries are exceeded
                    time.sleep(min(backoff, max_backoff))  # Wait with capped exponential backoff
                    backoff *= 2
        return wrapper
    return decorator

def yaml_read_file(file_path : str ) -> Dict[str , Dict[str , str]] :
    """
    Reads a YAML file and returns its contents as a dictionary.

    Args:
        file_path (str): Path to the YAML file containing base system prompt and tool use prompt injections.

    Returns:
        Dict[str, Dict[str, str]]: Returns the data contained in the YAML file.
    """
    with open(file_path, 'r') as file:
        content = yaml.safe_load(file)
    return content
