import React, { useState, useEffect } from "react";
import "./requests.css";
import Button from "../../components/Common/Button/Button";
import { User } from "../../global_types";
import RequestItem from "../../components/RequestItem/RequestItem";

export type Request = {
  name: string;
  amount: number;
  to: User;
  from: User;
  time_sent: Date;
  accepted: boolean;
};

function Requests() {
  const [requestName, setRequestName] = useState("");
  const [requestAmount, setRequestAmount] = useState("");
  const [requestsList, setRequestsList] = useState<Request[]>([
    {
      name: "Ticket",
      to: { username: "Max", id: 1 },
      from: { username: "You", id: 2 },
      amount: 50,
      time_sent: new Date(),
      accepted: false,
    },
    {
      name: "Coffee",
      to: {username: "You", id: 2},
      from: {username: "Max", id: 1},
      amount: 10,
      time_sent: new Date(),
      accepted: false
    }
  ]);


  const handleRequestNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRequestName(event.target.value);
  };

  const handleRequestAmountChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRequestAmount(event.target.value);
  };

  const handleAddRequest = () => {
    if (requestName.trim() !== "" && requestAmount.trim() !== "") {
      const newRequest = {
        name: requestName,
        amount: parseFloat(requestAmount),
        time_sent: new Date(),
        accepted: false,
        to: { id: 1, username: "Kieran" },
        from: { id: 2, username: "You" },
      };
      setRequestsList([...requestsList, newRequest]);
      // Clear input fields after adding request
      setRequestName("");
      setRequestAmount("");
    }
  };

  function downloadRequests() {

    // TODO: update this to make call to database instead

    // Write log data to a file
    const logData = requestsList
      .map((request) => `${request.name} - $${request.amount.toFixed(2)}`)
      .join("\n");

    // Create a Blob with the log data
    const blob = new Blob([logData], { type: "text/plain" });

    // Create a URL for the Blob
    const url = window.URL.createObjectURL(blob);

    // Create an anchor element
    const a = document.createElement("a");
    a.href = url;
    a.download = "requests.log"; // Set the filename for the downloaded file
    document.body.appendChild(a);

    // Trigger a click event on the anchor element to start the download
    a.click();

    // Remove the anchor element from the DOM
    document.body.removeChild(a);

    // Revoke the URL to free up memory
    window.URL.revokeObjectURL(url);
  }

  console.log(requestsList);

  // there is a better way to tell using the user id, just did this for now 
  const yourRequests = requestsList.filter((r)=> r.from.username === "You")
  const pendingRequests = requestsList.filter((r)=> r.to.username === "You")

  
  return (
    <div>
      <h2>Requests</h2>
      <div className="request-form">
        <div className="request-input">
          <input
            type="text"
            className="input"
            placeholder="Request Name"
            value={requestName}
            onChange={handleRequestNameChange}
          />
        </div>
        <div className="request-input">
          <input
            type="number"
            className="input"
            placeholder="Request Amount"
            value={requestAmount}
            onChange={handleRequestAmountChange}
          />
        </div>
        <div className="request-button">
          <Button
            action={handleAddRequest}
            text="Send Request"
            bg_color="green"
          />
        </div>
      </div>
      <button className="download-text" onClick={downloadRequests}>
        Download Data
      </button>
      <div className="request-lists">
        <div>
          <h3>Your Requests:</h3>
          <ul className="request-list">
            {yourRequests.map((request, index) => (
              <RequestItem request={request} key={index} />
            ))}
          </ul>
        </div>
        <div>
          <h3>Pending Requests:</h3>
          <ul className="request-list">
            {pendingRequests.map((request, index) => (
              <RequestItem request={request} key={index} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Requests;
