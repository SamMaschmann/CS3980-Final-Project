from fastapi import APIRouter, Path, HTTPException, status
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from backend.models.dataModels import Debt, DebtRequest, UserRequest

debt_router = APIRouter()

debt_list = []
nextId = 0

curUpdateID = 0


@debt_router.post("/debts", status_code=status.HTTP_201_CREATED)
async def add_debt(debt: DebtRequest) -> dict:
    global nextId
    nextId += 1

    newDebt = Debt(
        id=nextId, person=debt.person, amount=debt.amount, reason=debt.reason
    )
    debt_list.append(newDebt)

    json_data = newDebt.model_dump()
    return JSONResponse(json_data, status_code=status.HTTP_201_CREATED)


@debt_router.get("/debts")
async def get_debts() -> dict:
    json_data = jsonable_encoder(debt_list)
    return JSONResponse(content=json_data)


@debt_router.delete("/debts/{id}")
async def delete_debt(id: int) -> dict:
    for i in range(len(debt_list)):
        debt = debt_list[i]
        if debt.id == id:
            debt_list.pop(i)
            return {"message": "Item successfully removed"}
    return {"message": "Item could not be found"}


@debt_router.put("/updateDebts/{id}")
async def begin_update(id: int) -> dict:
    global curUpdateID
    curUpdateID = id
    return {"message": "id updated"}


@debt_router.put("/debts")
async def update_debt(debt: DebtRequest) -> dict:
    print(curUpdateID)
    for x in debt_list:
        print(x.id)
        if x.id == curUpdateID:
            print("Yippie")
            x.person = debt.person
            x.amount = debt.amount
            x.reason = debt.reason
            return {"message": "Todo updated successfully"}
    print("uhoh")
    return {"message": "Item could not found"}




@debt_router.post("/signup")
async def signup(userInfo: UserRequest) -> dict:
    username = userInfo.username
    password = userInfo.password

    #ADD ENTRY TO DATABASE HERE

    return {"user": username}
