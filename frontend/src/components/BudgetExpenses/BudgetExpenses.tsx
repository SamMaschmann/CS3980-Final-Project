import React from 'react'
import "./BudgetExpenses.css"


type Expense = {
    name: string,
    category: string,
    amount: number,
}

function BudgetExpenses() {

    const expenses: Expense[] = [{
        name: "Bagel",
        category: "Food",
        amount: 5
    }, {
        name: "Notebook",
        category: "School",
        amount: 10
    }]
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