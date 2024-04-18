// FriendItem.tsx

import React from 'react';
import './FriendItem.css'; // Assuming you have a CSS file for styling

export type Friend = {
  name: string;
  last_transaction: Date;
};

type Props = {
  friend: Friend; // Modify the prop to accept a single Friend object
  onUnfollow: () => void; // Callback function for unfollowing
};

const FriendItem: React.FC<Props> = ({ friend, onUnfollow }) => {
  const { name, last_transaction } = friend;
  
  return (
    <div className="friend-item">
      <div>{name}</div>
      <div>Last Transaction: {last_transaction.toDateString()}</div>
      <button onClick={onUnfollow}>Unfollow</button>
    </div>
  );
};

export default FriendItem;
