import React, { useState, useEffect } from 'react';

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

  useEffect(() => {
    // Write log data to a file
    const logData = requestsList.map(request => `${request.name} - $${request.amount.toFixed(2)}`).join('\n');
    
    // Create a Blob with the log data
    const blob = new Blob([logData], { type: 'text/plain' });
    
    // Create a URL for the Blob
    const url = window.URL.createObjectURL(blob);
    
    // Create an anchor element
    const a = document.createElement('a');
    a.href = url;
    a.download = 'requests.log'; // Set the filename for the downloaded file
    document.body.appendChild(a);
    
    // Trigger a click event on the anchor element to start the download
    a.click();
    
    // Remove the anchor element from the DOM
    document.body.removeChild(a);
    
    // Revoke the URL to free up memory
    window.URL.revokeObjectURL(url);
  }, [requestsList]);

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
