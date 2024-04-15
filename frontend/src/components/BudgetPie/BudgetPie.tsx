import React from "react";
import { Pie } from "react-chartjs-2";
import "./BudgetPie.css";
import { Expense } from "../../routes/budget/budget";

type BudgetPieProps = {
  expenses: Expense[];
};

function BudgetPie({expenses}: BudgetPieProps) {
  let result: Expense[] = [];

  // group by category and sum the expenses
  expenses.reduce(function (res, value) {
    if (!res[value.category]) {
      res[value.category] = { category: value.category, amount: 0 };
      //@ts-ignore
      result.push(res[value.category]);
    }
    res[value.category].amount += value.amount;
    return res;
  }, {});


  // get total of all expenses
  let total = result.reduce((a, b)=> a+b.amount, 0)


  let percentages = result.map((e)=> e.amount/total)
  let categories = result.map((e)=> e.category)



  const data = {
    labels: categories,
    datasets: [
      {
        label: "Percent of Expenses",
        data: percentages,
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
        ],
      },
    ],
  };
  return (
    <div className="budget-pie">
      <Pie data={data} />
    </div>
  );
}

export default BudgetPie;
