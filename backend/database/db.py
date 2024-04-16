from beanie import init_beanie
from motor.motor_asyncio import AsyncIOMotorClient
import os

from models.dataModels import Transaction


async def init_db():
    # This will not work until you add a file named .env and put the database secrets in it
    
    # sample env file
    
    #
    #
    # DB_CONN = "this_is_a_url_to_the_db"
    
    # Don't add .env file to git
    conn = os.getenv("DB_CONN")
    client = AsyncIOMotorClient(conn)
    await init_beanie(database=client.get_default_database(), document_models=[Transaction])