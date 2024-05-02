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

function Budget() {
  const [expenses, setExpenses] = useState<Expense[]>([]);

  const addExpense = (newExpense: Expense) => {
    setExpenses([...expenses, newExpense]);
  };

  const deleteExpense = (id: string) => {
    setExpenses(expenses.filter((expense) => expense.id !== id));
  };

  const editExpense = (id: string, updatedExpense: Expense) => {
    setExpenses(
      expenses.map((expense) => (expense.id === id ? updatedExpense : expense))
    );
  };

  useEffect(() => {
    async function fetchData() {
      const res = await axios.get(`http://localhost:8000/budgets?token=${localStorage.getItem("token")}`);
      const data = await res.data;
      setExpenses(data);

      console.log(expenses)
    }

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

  const BudgetExpenses: React.FC<{
    expenses: Expense[];
    deleteExpense: (id: string) => void;
    editExpense: (id: string, updatedExpense: Expense) => void;
  }> = ({ expenses, deleteExpense, editExpense }) => {
    return (
      <div className="budget-expenses-container">
        <h2 className="expenses-title">Expenses</h2>
        <ul>
          {expenses.map((expense) => (
            <BudgetItem {...expense} key={expense.id}/>
          ))}
        </ul>
      </div>
    );
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

      await axios.post(`http://localhost:8000/budgets?token=${localStorage.getItem("token")}`, {
        name,
        category,
        amount,
      });

      window.location.reload()

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
