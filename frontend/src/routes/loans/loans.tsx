import React, { useState, useEffect } from 'react';
import LoanItem from '../../components/LoanItem/LoanItem';
import "./loans.css"
import Button from '../../components/Common/Button/Button';

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

  function downloadLogs() {
    // Write log data to a file
    const logData = JSON.stringify(loansList, null, 2); // Convert loansList to JSON string with formatting
    
    // Create a Blob with the log data
    const blob = new Blob([logData], { type: 'text/plain' });
    
    // Create a URL for the Blob
    const url = window.URL.createObjectURL(blob);
    
    // Create an anchor element
    const a = document.createElement('a');
    a.href = url;
    a.download = 'loans.log'; // Set the filename for the downloaded file
    document.body.appendChild(a);
    
    // Trigger a click event on the anchor element to start the download
    a.click();
    
    // Remove the anchor element from the DOM
    document.body.removeChild(a);
    
    // Revoke the URL to free up memory
    window.URL.revokeObjectURL(url);
  }

  return (
    <div>
      <h2>Loans</h2>
      <div className="loan-form">
        <div className="loan-input">
          <input
            type="text"
            className="input"
            placeholder="Loan Name"
            value={loanName}
            onChange={handleLoanNameChange}
          />
        </div>
        <div className="loan-input">
          <input
            className="input"
            type="number"
            placeholder="Loan Amount"
            value={loanAmount}
            onChange={handleLoanAmountChange}
          />
        </div>
        <div className='loan-form-button'>
          <Button action={handleAddLoan} bg_color="green" text="Add Loan" />
        </div>
      </div>
      <div>
        <h3>Existing Loans:</h3>
        <button className='download-text' onClick={downloadLogs}>Download Data</button>
        <div className="loan-list">
          {loansList.map((loan, index) => (
            <LoanItem {...loan} key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Loans;
