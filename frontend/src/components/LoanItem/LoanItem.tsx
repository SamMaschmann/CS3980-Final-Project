import React from 'react'
import { Loan } from '../../routes/loans/loans'
import "./LoanItem.css"

function LoanItem({other_user, current_amount, description, file}: Loan) {
  return (
    <div className="loan-container">
      <div className="loan-top">
        <div className="loan-name">{other_user}</div>
        <div className="loan-amount">${current_amount.toLocaleString("en", {useGrouping: true})}.00</div>
      </div>

      <div className="loan-description">{description}</div>
      <div className="loan-file">{file}</div>
    </div>
  );
}

export default LoanItem