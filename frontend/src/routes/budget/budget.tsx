import React, { useState } from 'react';
import { Pie } from 'react-chartjs-2';
import "./budget.css";
import BudgetPie from '../../components/BudgetPie/BudgetPie';
import BudgetItem from '../../components/BudgetItem/BudgetItem';

export type Expense = {
  id: string;
  name: string;
  category: string;
  amount: number;
};

function Budget() {
  const [expenses, setExpenses] = useState<Expense[]>([
    {
      id: "1",
      name: "Bagel",
      category: "Food",
      amount: 5,
    },
    {
      id: "2",
      name: "Notebook",
      category: "School",
      amount: 10,
    },
  ]);

  const addExpense = (newExpense: Expense) => {
    setExpenses([...expenses, newExpense]);
  };

  const deleteExpense = (id: string) => {
    setExpenses(expenses.filter(expense => expense.id !== id));
  };

  const editExpense = (id: string, updatedExpense: Expense) => {
    setExpenses(expenses.map(expense => expense.id === id ? updatedExpense : expense));
  };

  const downloadExpenses = () => {
    const logData = expenses
      .map(expense => `${expense.name} - ${expense.amount}`)
      .join('\n');

    const blob = new Blob([logData], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'expenses.log';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const BudgetExpenses: React.FC<{ expenses: Expense[]; deleteExpense: (id: string) => void; editExpense: (id: string, updatedExpense: Expense) => void; }> = ({ expenses, deleteExpense, editExpense }) => {
    return (
      <div className="budget-expenses-container">
        <h2>Expenses</h2>
        <ul>
          {expenses.map(expense => (
            <BudgetItem {...expense}/>
          ))}
        </ul>
      </div>
    );
  };



  const ExpenseForm: React.FC<{ addExpense: (newExpense: Expense) => void; }> = ({ addExpense }) => {
    const [name, setName] = useState("");
    const [category, setCategory] = useState("");
    const [amount, setAmount] = useState(0);

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!name || !category || amount <= 0) return;
      addExpense({ id: Math.random().toString(), name, category, amount });
      setName("");
      setCategory("");
      setAmount(0);
    };

    return (
      <form onSubmit={handleSubmit} className='expense-form'>
        <h2>Add Expense</h2>
        <div className="expense-form-pair">
          <label>Name:</label>
          <div className="expense-form-input">
            <input
              className="input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>
        <div className="expense-form-pair">
          <label>Category:</label>
          <div className='expense-form-input'>
            <input
              type="text"
              className="input"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>
        </div>
        <div className="expense-form-pair">
          <label>Amount:</label>
          <div className='expense-form-input'>
            <input
              type="number"
              className="input"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value))}
            />
          </div>
        </div>
        <button type="submit" className='form-button'>Add Expense</button>
      </form>
    );
  };

  return (
    <div className="budget-container">
      <h1>Budget Management</h1>
      <div className="budget-content">
        <div className="expense-list">
          <ExpenseForm addExpense={addExpense} />
          <button className="download-text" onClick={downloadExpenses}>
            Download Expenses
          </button>
          <BudgetExpenses
            expenses={expenses}
            deleteExpense={deleteExpense}
            editExpense={editExpense}
          />
        </div>

        <BudgetPie expenses={expenses} />
      </div>
    </div>
  );
}

export default Budget;
