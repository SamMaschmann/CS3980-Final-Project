from fastapi import APIRouter, Path, HTTPException, status
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from debtModel import Debt, DebtRequest

debt_router = APIRouter()

debt_list = []
nextId = 0


@debt_router.post("/debts", status_code=status.HTTP_201_CREATED)
async def add_debt(debt: DebtRequest) -> dict:
    global nextId
    nextId += 1

    newDebt = Debt(id=nextId, person=debt.person, amount=debt.amount, reason=debt.reason)
    debt_list.append(newDebt)

    json_data = newDebt.model_dump()
    return JSONResponse(json_data, status_code=status.HTTP_201_CREATED)


@debt_router.get("/debts")
async def get_debts() -> dict:
    json_data = jsonable_encoder(debt_list)
    return JSONResponse(content=json_data)
