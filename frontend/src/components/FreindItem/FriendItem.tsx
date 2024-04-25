import React from 'react'
import { Friend } from '../../routes/friends/friends'
import "./FreindItem.css"
import Button from '../Common/Button/Button';
function FriendItem({name, last_transaction}: Friend) {
  return (
    <div className="friend-container">
      <div className="friend-top">
        <div className="friend-name">{name}</div>
        <div></div>
          <button className="friend-unfollow">Unfollow</button>
      </div>
      <div className="friend-date">
        {" "}
        Last Transaction: {last_transaction.toDateString()}
      </div>
    </div>
  );
}

export default FriendItem