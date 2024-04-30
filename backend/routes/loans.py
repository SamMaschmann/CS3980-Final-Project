from fastapi import APIRouter, Depends

from auth.auth import get_user
from database.db import Database
from models.dataModels import Loans, Users

import logging
logger = logging.getLogger(__name__)

loan_router = APIRouter(tags=["Loans"]) # What does this do?

loan_database = Database(Loans) 

@loan_router.get("/loans", response_model=list[Loans])
async def get_all_loans(user: Users = Depends(get_user)) -> list[Loans]:
    logger.info("[get /loans] Fetching loans for user " + user.username)
    
    loans = await loan_database.get_all(user.id)
    
    return loans

@loan_router.post("/loans")
async def create_loan(body: Loans, user: Users = Depends(get_user)) -> dict:
    logger.info("[post /loans] Adding loan for user " + user.username)
    body.user_id = user.id
    id = await loan_database.save(body)
    
    return {"message": f"loan with id {id} was created"}
