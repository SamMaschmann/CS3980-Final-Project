import React, { useState } from 'react';
import { Pie } from 'react-chartjs-2';
import "./budget.css";

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
            <li key={expense.id}>
              <div>{expense.name}</div>
              <div>{expense.category}</div>
              <div>{expense.amount}</div>
              <button onClick={() => editExpense(expense.id, { ...expense, amount: expense.amount + 1 })}>Edit</button>
              <button onClick={() => deleteExpense(expense.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const BudgetPie: React.FC<{ expenses: Expense[] }> = ({ expenses }) => {
    const data = {
      labels: expenses.map(expense => expense.name),
      datasets: [
        {
          label: 'Expenses',
          data: expenses.map(expense => expense.amount),
          backgroundColor: [
            'rgba(255, 99, 132, 0.5)',
            'rgba(54, 162, 235, 0.5)',
            'rgba(255, 206, 86, 0.5)',
            'rgba(75, 192, 192, 0.5)',
            'rgba(153, 102, 255, 0.5)',
            'rgba(255, 159, 64, 0.5)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };

    return (
      <div className="budget-pie-container">
        <h2>Budget Pie Chart</h2>
        <Pie data={data} />
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
      <form onSubmit={handleSubmit}>
        <h2>Add Expense</h2>
        <div>
          <label>Name:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label>Category:</label>
          <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} />
        </div>
        <div>
          <label>Amount:</label>
          <input type="number" value={amount} onChange={(e) => setAmount(parseFloat(e.target.value))} />
        </div>
        <button type="submit">Add Expense</button>
      </form>
    );
  };

  return (
    <div className="budget-container">
      <h1>Budget Management</h1>
      <div className="budget-content">
        
        <BudgetExpenses expenses={expenses} deleteExpense={deleteExpense} editExpense={editExpense}/>
        <ExpenseForm addExpense={addExpense} />
        <BudgetPie expenses={expenses}/>
        <button className="download-text" onClick={downloadExpenses}>
          Download Expenses
        </button>
      </div>
      
    </div>
  );
}

export default Budget;
