import React from 'react'
import { Expense } from '../../routes/budget/budget'
import "./BudgetItem.css"

function BudgetItem({name, category, amount}: Expense) {
  return (
    <div className="expense-container">
      <div className="top-expense">
        <div className="expense-name">{name}</div>
        <div className="expense-amount">${amount}.00</div>
      </div>
      <div className="bot-expense">
        <div className="expense-category">{category}</div>
        <div className='expense-actions'>
          <button className="expense-edit-button">Edit</button>
          <button className="expense-delete-button">Delete</button>
        </div>
      </div>
    </div>
  );
}

export default BudgetItem