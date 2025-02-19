import os
import uvicorn
from fastapi import FastAPI
from fastapi.responses import PlainTextResponse
from api.config.settings import get_settings
from api.logger.logger import get_logger
from api.routers import test_router
settings = get_settings()
logger = get_logger(__file__)


ascii_art ="""

 ██▒   █▓ ██▓    ▄████▄   ▒█████   ▄▄▄       ▄████▄   ██░ ██ 
▓██░   █▒▓██▒   ▒██▀ ▀█  ▒██▒  ██▒▒████▄    ▒██▀ ▀█  ▓██░ ██▒
 ▓██  █▒░▒██▒   ▒▓█    ▄ ▒██░  ██▒▒██  ▀█▄  ▒▓█    ▄ ▒██▀▀██░
  ▒██ █░░░██░   ▒▓▓▄ ▄██▒▒██   ██░░██▄▄▄▄██ ▒▓▓▄ ▄██▒░▓█ ░██ 
   ▒▀█░  ░██░   ▒ ▓███▀ ░░ ████▓▒░ ▓█   ▓██▒▒ ▓███▀ ░░▓█▒░██▓
   ░ ▐░  ░▓     ░ ░▒ ▒  ░░ ▒░▒░▒░  ▒▒   ▓▒█░░ ░▒ ▒  ░ ▒ ░░▒░▒
   ░ ░░   ▒ ░     ░  ▒     ░ ▒ ▒░   ▒   ▒▒ ░  ░  ▒    ▒ ░▒░ ░
     ░░   ▒ ░   ░        ░ ░ ░ ▒    ░   ▒   ░         ░  ░░ ░
      ░   ░     ░ ░          ░ ░        ░  ░░ ░       ░  ░  ░
     ░          ░                           ░                

"""
app = FastAPI(
    title="AI API App VI Coach",
)
logger.info(f"Starting App : \n {ascii_art}")

logger.info("App Ready")

app.include_router(test_router.router, tags=["Test"])

@app.get("/", response_class=PlainTextResponse)
async def root():
    return ascii_art



if __name__ == "__main__":
    try : 
        uvicorn.run(
            app,
            port=8002,
            host="0.0.0.0",

        )
    except KeyboardInterrupt as ki : 
        logger.info("Turning Server Off ...")
        logger.info("server Off")
    except Exception as e : 
        logger.error(f"Error occured in app : {e}")
        
    