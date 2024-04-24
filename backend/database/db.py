import asyncio
from beanie import init_beanie
from motor.motor_asyncio import AsyncIOMotorClient
import os

from models import Budgets, Loans, Payments, Transaction, Users


async def init_db():
    # This will not work until you add a file named .env and put the database secrets in it
    
    # sample env file
    
    #
    #
    # DB_CONN = "this_is_a_url_to_the_db"
    
    # Don't add .env file to git
    conn = os.getenv("DB_CONN")
    client = AsyncIOMotorClient(conn)
    await init_beanie(database=client.get_default_database(), document_models=[Users, Loans, Payments, Budgets])
    

# to test if db is connecting, run db.py
if __name__ == "__main__":
    asyncio.run(init_beanie)