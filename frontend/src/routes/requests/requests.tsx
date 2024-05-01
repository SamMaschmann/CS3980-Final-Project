import React, { useState, useEffect } from "react";
import "./requests.css";
import Button from "../../components/Common/Button/Button";
import { User } from "../../global_types";
import RequestItem from "../../components/RequestItem/RequestItem";
import axios from "axios";

export type Request = {
  _id: string
  user: string;
  other_user?: string;
  amount: number;
  created_at: string;
  description: string;
  accepted: boolean;
  state: "PENDING" | "DECLINED" | "ACCEPTED"
};

export type RequestRequest = {
  other_user: string
  amount: number
  description: string
}

function Requests() {
  const [requestName, setRequestName] = useState("");
  const [requestAmount, setRequestAmount] = useState("");
  const [requestDescription, setRequestDescription] = useState("")
  const [requestsList, setRequestsList] = useState<Request[]>([]);

  useEffect(()=> {
    async function fetchData() {
      const res = await axios.get(`http://localhost:8000/payments/all?token=${localStorage.getItem("token")}`)
      const data = await res.data
      setRequestsList(data)
    }
    fetchData()

    console.log(requestsList)
  }, [])

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

    const handleRequestDescriptionChange = (
      event: React.ChangeEvent<HTMLInputElement>
    ) => {
      setRequestDescription(event.target.value);
    };

  const handleAddRequest = async () => {
    if (requestName.trim() !== "" && requestAmount.trim() !== "") {
      const newRequest: RequestRequest = {
        other_user: requestName,
        amount: parseFloat(requestAmount),
        description: requestDescription
      };

      // send to backend
      await axios.post(
        `http://localhost:8000/payments?token=${localStorage.getItem("token")}`
      , newRequest);
      // setRequestsList([...requestsList, newRequest]);
      // Clear input fields after adding request

      setRequestName("");
      setRequestAmount("");
    }
  };

  function downloadRequests() {
    // TODO: update this to make call to database instead

    // Write log data to a file
    const logData = requestsList
      .map(
        (request) => `${request.description} - $${request.amount.toFixed(2)}`
      )
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


  // there is a better way to tell using the user id, just did this for now
  const yourRequests = requestsList.filter((r) => r.user === "jrenning");
  const pendingRequests = requestsList.filter((r) => r.other_user === "jrenning");

  return (
    <div>
      <h2>Requests</h2>
      <div className="request-form">
        <div className="request-input">
          <input
            type="text"
            className="input"
            placeholder="To"
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
        <div className="request-input">
          <input
            type="text"
            className="input"
            placeholder="Description"
            value={requestDescription}
            onChange={handleRequestDescriptionChange}
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
