from fastapi import APIRouter, HTTPException, Path, status
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse

from models.dataModels import Amount, Transaction, TransactionRequest, User

transactions_router = APIRouter()

sample_data: list[TransactionRequest] = [{"user": User(id=1, username="Tyler"), "other_user": User(id=2, username="Max"), "amount": Amount(amount_dollars=20, amount_cents=50), "outgoing": True, "description": "From python api"}]

@transactions_router.get("/transactions")
async def get_transactions() -> list[TransactionRequest]:
    # change types later to full Transaction 
    return sample_data

@transactions_router.post("/transactions", status_code=status.HTTP_201_CREATED)
async def add_transaction(data: TransactionRequest) -> JSONResponse:
    
    sample_data.append(data)
    
    return JSONResponse(data.model_dump(), status_code=status.HTTP_201_CREATED)


# Add delete and update items? Probably only for admin users

