from beanie import PydanticObjectId
from fastapi import APIRouter, Depends, HTTPException

from auth.auth import get_user
from database.db import Database
from models.dataModels import LoanUpdate, Loans, Users
from fastapi import status

loan_router = APIRouter(tags=["Loans"]) # What does this do?

loan_database = Database(Loans) 

@loan_router.get("/loans", response_model=list[Loans])
async def get_all_loans(user: Users = Depends(get_user)) -> list[Loans]:
    
    loans = await loan_database.get_all(user.id)
    
    return loans

@loan_router.post("/loans")
async def create_loan(body: Loans, user: Users = Depends(get_user)) -> dict:
    body.user_id = user.id
    id = await loan_database.save(body)
    
    return {"message": f"loan with id {id} was created"}

@loan_router.put("/loans/{id}")
async def update_loan(id: PydanticObjectId, body: LoanUpdate, user: Users = Depends(get_user)) -> Loans:
    
    # check if id exists 
    loan = await Loans.find(Loans.id == id)
    
    if not loan:
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
    
    return updated_loan
    
    