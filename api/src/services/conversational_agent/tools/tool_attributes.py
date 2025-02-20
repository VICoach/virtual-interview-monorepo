from pydantic import BaseModel, Field, validator
from typing import List, Dict, Any, Literal, Optional


class Header(BaseModel):
    key: str
    value: str

class QueryParam(BaseModel):
    name: str
    description: Optional[str] = ""
    example: Optional[Any] = None

class InputField(BaseModel):
    name: str
    description: Optional[str] = ""
    example: Optional[Any] = None
    type : str = "Text"

class Authentication(BaseModel):
    checked: bool
    location: str = ""
    key: str = ""
    value: str = ""

class SDE(BaseModel):
    checked: bool
    prompt: str = ""