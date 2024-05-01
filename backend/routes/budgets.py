from fastapi import APIRouter, Depends, HTTPException

from auth.auth import get_user
from database.db import Database
from models.dataModels import Expense, Budgets, Users
from beanie import PydanticObjectId

import logging
logger = logging.getLogger(__name__)

budget_router = APIRouter(tags=["Budgets"])

budget_database = Database(Budgets)

# Gets the budget for a user
@budget_router.get("/budgets", response_model=list[Budgets])
async def get_budget(user: Users = Depends(get_user)):
    logger.info("[get /bugets] Fetching budget (expenses) for user " + user.username)
    budgets = await budget_database.get_all(user.id)
    return budgets

# Adds expenses to a budget 
# If budget DNE, it will create one 
# Each user will have 1 budget
@budget_router.post("/budgets")
async def add_expense(body: Expense, user: Users = Depends(get_user)) -> dict:
    budgets = await budget_database.get_all(user.id)

    if budgets == []:
        logger.info("[post /budgets] user has no budget, creating one" + user.username)
        budget = Budgets(user_id=user.id, expenses=[body])
        await budget_database.save(budget)
    else:
        logger.info("[post /budgets] Adding expense for user " + user.username)
        budget = budgets[0]
        budget.expenses.append(body)
        await budget_database.update(budget.id, budget, ["id", "user_id"])

	
    return {"result": "success"}

# Edit an expense
@budget_router.put("/budgets/{budget_id}/expenses/{expense_id}")
async def edit_expense(budget_id: PydanticObjectId, expense_id: PydanticObjectId, expense_data: Expense, user: Users = Depends(get_user)) -> dict:
    # Fetch the budget
    budget = await Database(Budgets).get(budget_id)
    if not budget:
        raise HTTPException(status_code=404, detail="Budget not found")

    # Find the expense to update
    # Initialize expense_index to -1 indicating not found
    expense_index = -1

    # Loop through the expenses to find the matching expense by ID
    for index, exp in enumerate(budget.expenses):
        print(str(exp.id))
        print(expense_id)
        print()
        if str(exp.id) == str(expense_id):
            expense_index = index
            break  # Stop searching once the expense is found
    if expense_index == -1:
        raise HTTPException(status_code=404, detail="Expense not found")

    # Update the expense
    budget.expenses[expense_index] = expense_data

    # Save the updated budget
    updated = await Database(Budgets).update(budget_id, budget, ['id', 'user_id'])
    if not updated:
        raise HTTPException(status_code=500, detail="Failed to update expense")

    return {"message": "Expense updated successfully"}


@budget_router.delete("/budgets/{budget_id}/expenses/{expense_id}")
async def delete_expense(budget_id: PydanticObjectId, expense_id: PydanticObjectId, user: Users = Depends(get_user)) -> dict:
    budget = await budget_database.get(budget_id)
    if not budget:
        raise HTTPException(status_code=404, detail="Budget not found")
    if budget.user_id != user.id:
        raise HTTPException(status_code=404, detail="Access denied")

    # Remove the expense from the budget
    new_expenses = [e for e in budget.expenses if e.id != expense_id]
    if len(new_expenses) == len(budget.expenses):
        raise HTTPException(status_code=404, detail="Expense not found")

    budget.expenses = new_expenses
    
    # Save changes
    updated_budget = await budget_database.update(budget_id, budget, ['id', 'user_id'])
    if updated_budget:
        return {"message": "Expense deleted successfully"}
    else:
        raise HTTPException(status_code=500, detail="Failed to delete expense")
