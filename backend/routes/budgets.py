from fastapi import APIRouter, Depends

from auth.auth import get_user
from database.db import Database
from models.dataModels import Expense, Budgets, Users

budget_router = APIRouter(tags=["Budgets"])

budget_database = Database(Budgets)

@budget_router.get("/budgets", response_model=list[Budgets])
async def get_budget(user: Users = Depends(get_user)):
	budgets = await budget_database.get_all(user.id)
	return budgets

@budget_router.post("/budgets")
async def add_expense(body: Expense, user: Users = Depends(get_user)) -> dict:
	budgets = await budget_database.get_all(user.id)
	if budgets != []:
		budget = budgets[0]
		budget.expenses.append(body)
		print(budget)
		await budget_database.update(budget.id, budget)
	else:
		budget = Budgets(user_id=user.id, expenses=[body])
		await budget_database.save(budget)
	
	return {"result": "success"}
	