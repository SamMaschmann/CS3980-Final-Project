import React, { useState } from 'react';


export type Loan = {
    name: string,
    amount: number
}

function Loans() {
  const [loanName, setLoanName] = useState('');
  const [loanAmount, setLoanAmount] = useState<string>("");
  const [loansList, setLoansList] = useState<Loan[]>([]);

  const handleLoanNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLoanName(event.target.value);
  };
  
  const handleLoanAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLoanAmount(event.target.value);
  };

  const handleAddLoan = () => {
    if (loanName.trim() !== '' && loanAmount.trim() !== '') {
      const newLoan = {
        name: loanName,
        amount: parseFloat(loanAmount),
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
        <ul>
          {loansList.map((loan, index) => (
            <li key={index}>
              {loan.name} - ${loan.amount.toFixed(2)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Loans;