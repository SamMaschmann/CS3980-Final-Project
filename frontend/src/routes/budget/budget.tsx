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
      <div className="budget-content">
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
                onEdit={(editedExpense: Expense) => editExpense(expense.id, editedExpense)}
              />
            ))}
          </ul>
        </div>
        <BudgetPie expenses={expenses} />
      </div>
    </div>
  );
}

export default Budget;
