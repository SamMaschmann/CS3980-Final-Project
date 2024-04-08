import React, { useState } from 'react';
import LoanItem from '../../components/LoanItem/LoanItem';
import "./loans.css"

export type Loan = {
    otherParty: string
    description: string
    amount: number
}

function Loans() {
  const [loanName, setLoanName] = useState('');
  const [loanAmount, setLoanAmount] = useState<string>("");
  const [loansList, setLoansList] = useState<Loan[]>([{
    otherParty: "Mike",
    description: "For the car",
    amount: 5000
  }, {
    otherParty: "Carol",
    description: "For starting a restaurant",
    amount: 10000
  }]);

  const handleLoanNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLoanName(event.target.value);
  };
  
  const handleLoanAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLoanAmount(event.target.value);
  };

  const handleAddLoan = () => {
    if (loanName.trim() !== '' && loanAmount.trim() !== '') {
      const newLoan = {
        description: loanName,
        amount: parseFloat(loanAmount),
        otherParty: "Mandy"
      };
      
      setLoansList([...loansList, newLoan]);
      // Clear input fields after adding loan
      setLoanName('');
      setLoanAmount('');
    }
  };

  return (
    <div>
      <h2>Loans</h2>
      <div>
        <input
          type="text"
          placeholder="Loan Name"
          value={loanName}
          onChange={handleLoanNameChange}
        />
        <input
          type="number"
          placeholder="Loan Amount"
          value={loanAmount}
          onChange={handleLoanAmountChange}
        />
        <button onClick={handleAddLoan}>Add Loan</button>
      </div>
      <div>
        <h3>Existing Loans:</h3>
        <div className='loan-list'>
          {loansList.map((loan, index) => (
            <LoanItem {...loan} key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Loans;