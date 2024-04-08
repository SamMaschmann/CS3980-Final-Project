import React, { useState } from 'react';

export type Request = {
    name: string,
    amount: number
}

function Requests() {
  const [requestName, setRequestName] = useState('');
  const [requestAmount, setRequestAmount] = useState('');
  const [requestsList, setRequestsList] = useState<Request[]>([]);

  const handleRequestNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRequestName(event.target.value);
  };
  
  const handleRequestAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRequestAmount(event.target.value);
  };

  const handleAddRequest = () => {
    if (requestName.trim() !== '' && requestAmount.trim() !== '') {
      const newRequest = {
        name: requestName,
        amount: parseFloat(requestAmount),
      };
      setRequestsList([...requestsList, newRequest]);
      // Clear input fields after adding request
      setRequestName('');
      setRequestAmount('');
    }
  };

  return (
    <div>
      <h2>Requests</h2>
      <div>
        <input
          type="text"
          placeholder="Request Name"
          value={requestName}
          onChange={handleRequestNameChange}
        />
        <input
          type="number"
          placeholder="Request Amount"
          value={requestAmount}
          onChange={handleRequestAmountChange}
        />
        <button onClick={handleAddRequest}>Add Request</button>
      </div>
      <div>
        <h3>Existing Requests:</h3>
        <ul>
          {requestsList.map((request, index) => (
            <li key={index}>
              {request.name} - ${request.amount.toFixed(2)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Requests;