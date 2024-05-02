import React, { useState } from 'react';
import { Expense } from '../../routes/budget/budget';
import './BudgetItem.css';
import axios from 'axios';

interface BudgetItemProps extends Expense {
  onDelete: () => void;
  onEdit: (editedExpense: Expense) => void; // Updated type signature
}

function BudgetItem({ name, category, amount, id, onDelete, onEdit }: BudgetItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedExpense, setEditedExpense] = useState<Expense>({ name, category, amount, id });

  const handleDelete = async () => {
    await axios.delete(`http://localhost:8000/budgets/expenses/${id}?token=${localStorage.getItem("token")}`);
    onDelete();
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    await axios.put(`http://localhost:8000/budgets/expenses/${id}?token=${localStorage.getItem("token")}`, editedExpense);
    onEdit(editedExpense); // Pass edited expense to onEdit function
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedExpense({ name, category, amount, id });
    setIsEditing(false);
  };

  return (
    <div className="expense-container">
      <div className="top-expense">
        {isEditing ? (
          <input
            type="text"
            value={editedExpense.name}
            onChange={(e) => setEditedExpense({ ...editedExpense, name: e.target.value })}
          />
        ) : (
          <div className="expense-name">{name}</div>
        )}
        <div className="expense-amount">${amount}.00</div>
      </div>
      <div className="bot-expense">
        {isEditing ? (
          <input
            type="text"
            value={editedExpense.category}
            onChange={(e) => setEditedExpense({ ...editedExpense, category: e.target.value })}
          />
        ) : (
          <div className="expense-category">{category}</div>
        )}
        <div className="expense-actions">
          {isEditing ? (
            <>
              <button className="expense-save-button" onClick={handleSaveEdit}>Save</button>
              <button className="expense-cancel-button" onClick={handleCancelEdit}>Cancel</button>
            </>
          ) : (
            <>
              <button className="expense-edit-button" onClick={handleEdit}>Edit</button>
              <button className="expense-delete-button" onClick={handleDelete}>Delete</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default BudgetItem;
