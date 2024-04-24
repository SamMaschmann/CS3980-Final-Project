from fastapi import APIRouter

from database.db import Database
from models.dataModels import Loans


loan_router = APIRouter(tags=["Loans"])

loan_database = Database(Loans)

#  TODO: add user auth
@loan_router.get("/", response_model=list[Loans])
async def get_all_loans() -> list[Loans]:
    loans = await loan_database.get_all()
    
    return loans

@loan_router.post("/")
async def create_loan(body: Loans) -> dict:
    id = await loan_database.save(body)
    
    return {"message": f"loan with id {id} was created"}