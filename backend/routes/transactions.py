from fastapi import APIRouter, HTTPException, Path, status
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse

from models.dataModels import Amount, Transaction, User

transactions_router = APIRouter()


@transactions_router.get("/transactions")
async def get_transactions() -> list[Transaction]:
    sample_data: list[Transaction] = [{"user": User(id=1, username="Tyler"), "other_user": User(id=2, username="Max"), "amount": Amount(amount_dollars=20, amount_cents=50), "outgoing": True, "description": "From python api"}]
    
    return sample_data