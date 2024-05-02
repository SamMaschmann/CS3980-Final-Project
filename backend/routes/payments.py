from beanie import PydanticObjectId
from fastapi import APIRouter, Depends, HTTPException, Path, status
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from pydantic import BaseModel

from auth.auth import get_user
from database.db import Database
from models.dataModels import PaymentRequest, PaymentState, Payments, Users

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
    # filter out ones that aren't accepted
    transactions = transactions_to + transactions_from
    
    transactions = [x for x in transactions if x.state == PaymentState.ACCEPTED]
    
    return transactions

# used fro requests route
@payments_router.get("/payments/all")
async def get_transactions(user: Users = Depends(get_user)) -> list[Payments]:
    logger.info("[get /payments] Fetching payments for user " + user.username)
    transactions_from = await Payments.find(Payments.user == user.username).to_list()
    transactions_to = await Payments.find(Payments.other_user == user.username).to_list()
    # filter out ones that are accepted
    transactions = transactions_to + transactions_from
    transactions = [x for x in transactions if x.state != PaymentState.ACCEPTED]

    return transactions


@payments_router.post("/payments", status_code=status.HTTP_201_CREATED)
async def add_transaction(body: PaymentRequest, user: Users = Depends(get_user)) -> JSONResponse:
    logger.info("[post /payments] Adding transaction for user " + user.username)
    new_transaction = Payments(user=user.username, other_user=body.other_user, amount=body.amount, description=body.description, loan_id=None, payment_plan=None)
    id = await new_transaction.insert()
    
    return JSONResponse({"message": f"Payment to {body.other_user} successfully requested"}, status_code=status.HTTP_201_CREATED)


class PaymentUpdateRequest(BaseModel):
    state: PaymentState
    


@payments_router.put("/payments/{id}")
async def update_payment(id: PydanticObjectId, body: PaymentUpdateRequest, user: Users = Depends(get_user)) -> Payments:
    logger.info(f"User {user} is updating payment = {id}")
    # check if id exists 
    payment = await Payments.find_one(Payments.id == id)
    
    print(payment)
    
    if not payment:
        logger.warning(f"Payment with id = {id} does not exist")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Payment with id = {id} does not exist"
        )
    
    # check to see if user accepting is other user
    if payment.other_user != user.username:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Payment with id = {id} does not exist"
        )
    
    updated_payment = await payments_database.update(id, body)
    
    logger.info(f"Payment with id = {id} was updated")
    
    return updated_payment


@payments_router.delete("/payments/{id}")
async def delete_request(id: PydanticObjectId, user: Users = Depends(get_user)) -> dict:
    # get object
    payment = await Payments.find_one(Payments.id == id)
    
    # if not user who made it can't delete it 
    if payment.user != user.username:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not the user who made this request"
        )
    

    # if accepted can't delete
    if payment.state == PaymentState.ACCEPTED:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Can't delete accepted requests"
        )
    
    await payment.delete()
    
    logger.info(f"Payment with id = {id} was deleted")
    
    return {"message": f"Request with id = {id} successfully deleted"}
    
    

# TODO: add method to make payment on loan
# TODO: add method to get all payments on a loan


# Add delete and update items? Probably only for admin users
