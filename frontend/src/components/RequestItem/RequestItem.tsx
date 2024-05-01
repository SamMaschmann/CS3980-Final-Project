import React from 'react'
import { Request } from '../../routes/requests/requests'
import "./RequestItem.css"
import Button from '../Common/Button/Button'
import axios from 'axios'
type Props = {
    request: Request
}

function RequestItem({request}: Props) {


async function handleRequestAction(type: "Accept" | "Decline") {
    
    const response = type == "Accept" ? "ACCEPTED" : "DECLINED"

    await axios.put(`http://localhost:8000/payments/${request._id}?token=${localStorage.getItem("token")}`, {state: response})

    // for now just reload to show changes
    window.location.reload()


}

async function deleteRequest() {
  await axios.delete(`http://localhost:8000/payments/${request._id}?token=${localStorage.getItem("token")}`)
  window.location.reload()
}


  return (
    <div className="request-container">
      <div className="request-top">
        <div className="request-names">
          <span className="request-from">{request.user}</span> requested
          <span className="request-to">{request.other_user}</span>
        </div>
        <div className="request-amount">
          ${request.amount.toLocaleString("en", { useGrouping: true })}.00
        </div>
      </div>
      <div className="request-time">{request.created_at.slice(0, 10)}</div>
      <div className="request-body">{request.description}</div>
      {/* TODO: FIX this with better check */}
      {request.other_user === "jrenning" ? (
        <div className="request-actions">
          <div className="request-accept">
            <Button
              text="Accept"
              bg_color="green"
              action={() => handleRequestAction("Accept")}
            />
          </div>
          <div className="request-accept">
            <Button
              text="Decline"
              bg_color="red"
              action={() => handleRequestAction("Decline")}
            />
          </div>
        </div>
      ) : (
        <div>
          {request.state === "PENDING" ? (
            <div className="pending">Pending...</div>
          ) : (
            <div className="declined">X Declined</div>
          )}
          <div className='delete-container'>
            <button className="delete-button" onClick={()=> deleteRequest()}>Delete</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default RequestItem