import asyncio
import json
from typing import Any, Optional
from beanie import PydanticObjectId, init_beanie
import certifi
from motor.motor_asyncio import AsyncIOMotorClient
import os

from pydantic import BaseModel, Field
from pydantic_settings import BaseSettings, SettingsConfigDict

from models.dataModels import Budgets, Loans, Payments, Users

import logging
logger = logging.getLogger(__name__)

## STARTED FROM: https://github.com/changhuixu/CS3980-2024/blob/main/event_planner/planner/database/connection.py

class Settings(BaseSettings):
   # This will not work until you add a file named .env and put the database secrets in it
    
    # sample env file
    
    #
    #
    # DB_CONN = "this_is_a_url_to_the_db"
    # future tip, make sure it looks like this "mongodb+srv://user:pass@cluster.mongodb.net/database_name"
    
    # Don't add .env file to git
    DB_CONN: str = Field(default="")
    SECRET_KEY: str = Field(default="")

    model_config = SettingsConfigDict(env_file=".env")

    async def initialize_database(self):
        # idk why it needs the certifi line, but it won't work without it
        client = AsyncIOMotorClient(self.DB_CONN, tlsCAFile=certifi.where())
        await init_beanie(
            database=client.get_default_database(), document_models=[Users, Loans, Payments, Budgets]
        )
        
class Database:
    def __init__(self, model):
        self.model = model

    async def save(self, document) -> PydanticObjectId:
        logger.info("Saving document to mongoDB")
        m = await document.create()
        return m.id

    async def get(self, id: PydanticObjectId) -> Any:
        logger.info("Fetching document from mongoDB")
        doc = await self.model.get(id)
        if doc:
            return doc
        return False
    
    async def get_all(self, username) -> list[Any]:
        docs = await self.model.find(self.model.user == username).to_list()
        logger.info(f"Fetched {len(docs)} documents from mongoDB")
        return docs

    async def update(self, id: PydanticObjectId, body: BaseModel, exclude_fields: Optional[list[str]] = None) -> Any:
        logger.info(f"Updating document from mongoDB {id}")
        des_body = body.model_dump_json(exclude_defaults=True)
        des_body = json.loads(des_body)

        # Avoid updating fields in exclude_fields (id, user_id, etc)
        if exclude_fields:
            for s in exclude_fields:
                des_body.pop(s, None)

        doc = await self.get(id)
        if not doc:
            return False
        await doc.set(des_body)
        return doc

    async def delete(self, id: PydanticObjectId) -> bool:
        doc = await self.get(id)
        if not doc:
            logger.info("Unsuccessfully deleted document in mongoDB")
            return False
        await doc.delete()
        logger.info("Successfully deleted document from mongoDB")
        return True        


# to test if db is connecting, run db.py
if __name__ == "__main__":
    asyncio.run(init_beanie)
