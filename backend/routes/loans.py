from beanie import PydanticObjectId
from fastapi import APIRouter, Depends, HTTPException

from auth.auth import get_user
from database.db import Database
from models.dataModels import LoanRequest, LoanUpdate, Loans, Users
from fastapi import status

import logging
logger = logging.getLogger(__name__)

loan_router = APIRouter(tags=["Loans"]) # What does this do? # just adds a section to the docs, helps organize 

loan_database = Database(Loans) 

@loan_router.get("/loans", response_model=list[Loans])
async def get_all_loans(user: Users = Depends(get_user)) -> list[Loans]:
    logger.info("[get /loans] Fetching loans for user " + user.username)
    
    loans = await loan_database.get_all(user.username)
    
    return loans

@loan_router.post("/loans")
async def create_loan(body: LoanRequest, user: Users = Depends(get_user)) -> Loans:
    logger.info("[post /loans] Adding loan for user " + user.username)
    body.user = user.username
    
    new_loan = Loans(user=user.username, other_user=body.other_user, current_amount=body.amount, original_amount=body.amount, accepted=False, description=body.description)
    id = await loan_database.save(new_loan)
    
    return new_loan


@loan_router.put("/loans/{id}")
async def update_loan(id: PydanticObjectId, body: LoanUpdate, user: Users = Depends(get_user)) -> Loans:
    
    logger.info(f"User {user} is updating loan id = {id}")
    # check if id exists 
    loan = await Loans.find(Loans.id == id)
    
    if not loan:
        logger.warning(f"Loan with id = {id} does not exist")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Loan with id = {id} does not exist"
        )
    
    # check to see if user sending request is user who gave loan
    if loan.user != user.username:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Loan with id = {id} does not exist"
        )
    
    updated_loan = await loan_database.update(id, body)
    
    logger.info(f"Loan with id = {id} was updated")
    
    return updated_loan
    
    