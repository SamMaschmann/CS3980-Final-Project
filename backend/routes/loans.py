from fastapi import APIRouter, Depends

from auth.auth import get_user
from database.db import Database
from models.dataModels import Loans, Users


loan_router = APIRouter(tags=["Loans"])

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