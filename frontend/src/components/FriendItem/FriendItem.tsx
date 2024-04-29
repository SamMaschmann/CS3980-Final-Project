// FriendItem.tsx

import React from 'react';
import './FriendItem.css'; // Assuming you have a CSS file for styling

export type Friend = {
  name: string;
  // last_transaction: Date;
};

// for now just show username
type Props = {
  friend: string; // Modify the prop to accept a single Friend object
  onUnfollow: () => void; // Callback function for unfollowing
};

const FriendItem: React.FC<Props> = ({ friend, onUnfollow }) => {
  
  return (
    <div className="friend-container">
      <div className='friend-top'>
        <div className='friend-name'>{friend}</div>
        {/* <div>Last Transaction: {last_transaction.toDateString()}</div> */}
        <button onClick={onUnfollow} className="friend-unfollow">
          Unfollow
        </button>
      </div>
    </div>
  );
};

export default FriendItem;
