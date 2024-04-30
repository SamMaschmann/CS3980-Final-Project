from fastapi import APIRouter, Depends, HTTPException, Path, status
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse

from auth.auth import get_user
from database.db import Database
from models.dataModels import PaymentRequest, Payments, Users

import logging
logger = logging.getLogger(__name__)

payments_router = APIRouter(tags=["Payments"])

payments_database = Database(Payments)

# yes I know it's confusing having things called payments and things called transactions

@payments_router.get("/payments")
async def get_transactions(user: Users = Depends(get_user)) -> list[Payments]:
    logger.info("[get /payments] Fetching payments for user " + user.username)
    transactions_from = await Payments.find(Payments.user == user.username).to_list()
    transactions_to = await Payments.find(Payments.other_user == user.username).to_list()
    
    # filter out ones that are
    transactions = transactions_to + transactions_from
    
    return transactions


@payments_router.post("/payments", status_code=status.HTTP_201_CREATED)
async def add_transaction(body: PaymentRequest, user: Users = Depends(get_user)) -> JSONResponse:
    logger.info("[post /payments] Adding transaction for user " + user.username)
    new_transaction = Payments(user=user.username, other_user=body.other_user, amount=body.amount, description=body.description, loan_id=None, payment_plan=None)
    id = await payments_database.save(new_transaction)
    
    return JSONResponse({"message": "Hello"}, status_code=status.HTTP_201_CREATED)


# TODO: add method to make payment on loan
# TODO: add method to get all payments on a loan


# Add delete and update items? Probably only for admin users
