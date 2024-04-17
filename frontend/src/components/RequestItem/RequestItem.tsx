import React from 'react'
import { Request } from '../../routes/requests/requests'
import "./RequestItem.css"
import Button from '../Common/Button/Button'
type Props = {
    request: Request
}

function RequestItem({request}: Props) {


async function handleRequestAction(type: "Accept" | "Decline") {
    
    // Handle this with an api call



}   


  return (
    <div className="request-container">
      <div className="request-top">
        <div className="request-names">
          <span className="request-from">{request.from.username}</span>{" "}
          requested
          <span className="request-to">{request.to.username}</span>
        </div>
        <div className="request-amount">${request.amount}.00</div>
      </div>
      <div className="request-time">{request.time_sent.toDateString()}</div>
      <div className="request-body">{request.name}</div>
      {/* TODO: FIX this with better check */}
      {request.to.username === "You" ? (
        <div className='request-actions'>
          <div className="request-accept">
            <Button text="Accept" bg_color="green" action={()=> handleRequestAction("Accept")}/>
          </div>
          <div className="request-accept">
            <Button text="Decline" bg_color="red" action={()=> handleRequestAction("Decline")}/>
          </div>
        </div>
      ) : <div>
        {request.accepted ? <div></div> : <div className='declined'>X Declined</div>}
        </div>}
    </div>
  );
}

export default RequestItem