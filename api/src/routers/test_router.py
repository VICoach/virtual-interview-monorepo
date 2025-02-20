from fastapi import APIRouter, HTTPException
from src.schemas.test_schema import TestCreate, TestResponse
from src.logger.logger import get_logger



logger = get_logger(__file__)
router = APIRouter()



@router.post(path="/test")
async def test(test : TestCreate) -> TestResponse:
    logger.debug(f"Test : {test}")
    return test
