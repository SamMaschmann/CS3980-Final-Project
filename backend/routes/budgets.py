from fastapi import APIRouter, Depends

from auth.auth import get_user
from database.db import Database
from models.dataModels import Expense, Budgets, Users
from beanie import PydanticObjectId

import logging
logger = logging.getLogger(__name__)

budget_router = APIRouter(tags=["Budgets"])

budget_database = Database(Budgets)

# Gets the budget for a user

@budget_router.get("/budgets", response_model=list[Expense])
async def get_budget(user: Users = Depends(get_user)):
    logger.info("[get /budgets] Fetching budget (expenses) for user " + user.username)
    budgets = await Budgets.find_one(Budgets.user == user.username)
    # just return expenses for now
    return budgets.expenses

@budget_router.delete("/budgets/expenses/{id}")
async def delete_expense(id: PydanticObjectId, user = Depends(get_user)):
    # get the one budget a user has
    budget = await Budgets.find_one(Budgets.user == user.username)
    budget.expenses = [x for x in budget.expenses if x.id != id]
    
    await budget.save()

# Adds expenses to a budget 
# If budget DNE, it will create one 
# Each user will have 1 budget
@budget_router.post("/budgets")
async def add_expense(body: Expense, user: Users = Depends(get_user)) -> dict:
    budgets = await budget_database.get_all(user.username)

    if budgets == []:
        logger.info("[post /budgets] user has no budget, creating one" + user.username)
        budget = Budgets(user=user.username, expenses=[body])
        await budget_database.save(budget)
    else:
        logger.info("[post /budgets] Adding expense for user " + user.username)
        budget = budgets[0]
        budget.expenses.append(body)
        await budget_database.update(budget.id, budget, ["id", "user"])

	
    return {"result": "success"}
	
