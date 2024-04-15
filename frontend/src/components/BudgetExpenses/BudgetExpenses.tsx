import React from 'react'
import "./BudgetExpenses.css"
import { Expense } from '../../routes/budget/budget';

type Props = {
  expenses: Expense[]
}


function BudgetExpenses({ expenses}:Props ) {


  return (
    <div className="expense-table-container">
      <div className="expense-table-title">Expenses</div>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Amount ($)</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((e) => (
            <tr>
              <td>{e.name}</td>
              <td>{e.category}</td>
              <td>{e.amount}</td>
              <td className='action-row'>
                <button className='edit-button'>Edit</button>
                <button className='delete-button'>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BudgetExpenses