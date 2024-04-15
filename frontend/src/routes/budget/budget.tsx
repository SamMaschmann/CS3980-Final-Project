import React from 'react'
import BudgetExpenses from '../../components/BudgetExpenses/BudgetExpenses'
import { Pie } from 'react-chartjs-2'
import "./budget.css"
import BudgetPie from '../../components/BudgetPie/BudgetPie';


export type Expense = {
  name: string;
  category: string;
  amount: number;
};


function Budget() {

  const expenses: Expense[] = [
    {
      name: "Bagel",
      category: "Food",
      amount: 5,
    },
    {
      name: "Notebook",
      category: "School",
      amount: 10,
    },
  ];



  return (
    <div>
      <BudgetExpenses expenses={expenses}/>
      <BudgetPie expenses={expenses}/>
    </div>
  );
}

export default Budget