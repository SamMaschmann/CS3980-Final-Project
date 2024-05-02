import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import "./budget.css";
import BudgetPie from "../../components/BudgetPie/BudgetPie";
import BudgetItem from "../../components/BudgetItem/BudgetItem";
import axios from "axios";

export type Expense = {
  id: string;
  name: string;
  category: string;
  amount: number;
};

const ExpenseForm: React.FC<{
  addExpense: (newExpense: Expense) => void;
}> = ({ addExpense }) => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !category || amount <= 0) return;

    await axios.post(
      `http://localhost:8000/budgets?token=${localStorage.getItem("token")}`,
      {
        name,
        category,
        amount,
      }
    );

    window.location.reload();

    setName("");
    setCategory("");
    setAmount(0);
  };

  return (
    <form onSubmit={handleSubmit} className="expense-form">
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
        <div className="expense-form-input">
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
        <div className="expense-form-input">
          <input
            type="number"
            className="input"
            value={amount}
            onChange={(e) => setAmount(parseFloat(e.target.value))}
          />
        </div>
      </div>
      <button type="submit" className="form-button">
        Add Expense
      </button>
    </form>
  );
};


function Budget() {
  const [expenses, setExpenses] = useState<Expense[]>([]);

  const fetchData = async () => {
    const res = await axios.get(`http://localhost:8000/budgets?token=${localStorage.getItem("token")}`);
    const data = await res.data;
    setExpenses(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const downloadExpenses = () => {
    const logData = expenses
      .map((expense) => `${expense.name} - ${expense.amount}`)
      .join("\n");

    const blob = new Blob([logData], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "expenses.log";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const deleteExpense = async (id: string) => {
    await axios.delete(`http://localhost:8000/budgets/expenses/${id}?token=${localStorage.getItem("token")}`);
    fetchData();
  };

  const editExpense = async (id: string, updatedExpense: Expense) => {
    await axios.put(`http://localhost:8000/budgets/expenses/${id}?token=${localStorage.getItem("token")}`, updatedExpense);
    fetchData();
  };

  const addExpense = async (newExpense: Expense) => {
    await axios.post(`http://localhost:8000/budgets?token=${localStorage.getItem("token")}`, newExpense);
    fetchData();
  };

  return (
    <div className="budget-container">
      <h1>Budget Management</h1>
      <div className="budget-content"></div>
      <div className="budget-add">
        <ExpenseForm addExpense={addExpense} />
        <div className="expense-list">
          <h2>Expenses</h2>
          <button className="download-text" onClick={downloadExpenses}>
            Download Expenses
          </button>
          <ul>
            {expenses.map((expense) => (
              <BudgetItem
                {...expense}
                key={expense.id}
                onDelete={() => deleteExpense(expense.id)}
                onEdit={(editedExpense: Expense) =>
                  editExpense(expense.id, editedExpense)
                }
              />
            ))}
          </ul>
        </div>
      </div>
      <div>
        <BudgetPie expenses={expenses} />
      </div>
    </div>
  );
}

export default Budget;
