import React from 'react'
import { Loan } from '../../routes/loans/loans'
import "./LoanItem.css"

function LoanItem({otherParty, amount, description}: Loan) {
  return (
    <div className="loan-container">
      <div className="loan-top">
        <div className="loan-name">{otherParty}</div>
        <div className="loan-amount">${amount.toLocaleString("en", {useGrouping: true})}.00</div>
      </div>

      <div className="loan-description">{description}</div>
    </div>
  );
}

export default LoanItem