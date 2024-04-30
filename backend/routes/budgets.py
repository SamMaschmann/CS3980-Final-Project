from fastapi import APIRouter, Depends

from auth.auth import get_user
from database.db import Database
from models.dataModels import Expense, Budgets, Users

import logging
logger = logging.getLogger(__name__)

budget_router = APIRouter(tags=["Budgets"])

budget_database = Database(Budgets)

# Get the budget for a user
@budget_router.get("/budgets", response_model=list[Budgets])
async def get_budget(user: Users = Depends(get_user)):
    logger.info("[get /bugets] Fetching budget (expenses) for user " + user.username)
    budgets = await budget_database.get_all(user.id)
    return budgets

# Add expenses to a budget 
# If budget DNE, it will create one 
# Each user will have 1 budget
@budget_router.post("/budgets")
async def add_expense(body: Expense, user: Users = Depends(get_user)) -> dict:
    budgets = await budget_database.get_all(user.id)

    if budgets == []:
        logger.info("[post /budgets] user has no budget, creating one" + user.username)
        budget = Budgets(user_id=user.id, expenses=[body])
        print(budget)
        await budget_database.save(budget)
    else:
        logger.info("[post /budgets] Adding expense for user " + user.username)
        budget = budgets[0]
        budget.expenses.append(body)
        await budget_database.update(budget.id, budget, ["id", "user_id"])

	
    return {"result": "success"}
	
