import React from 'react'
import { Expense } from '../../routes/budget/budget'
import "./BudgetItem.css"
import axios from 'axios';

function BudgetItem({name, category, amount, id}: Expense) {
  async function handleDelete() {
    await axios.delete(`http://localhost:8000/budgets/expenses/${id}`)
  }
  
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
          <button className="expense-delete-button" onClick={()=> handleDelete()}>Delete</button>
        </div>
      </div>
    </div>
  );
}

export default BudgetItem