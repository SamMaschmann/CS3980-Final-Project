import React, { useState } from 'react';
import Button from '../../components/Common/Button/Button';
import './friends.css';
import FriendItem, { Friend } from '../../components/FriendItem/FriendItem';

function Friends() {
  const [friends, setFriends] = useState<Friend[]>([
    {
      name: 'Aaron',
      last_transaction: new Date(),
    },
    {
      name: 'Becky',
      last_transaction: new Date('1/1/1971'),
    },
    {
      name: 'Anna',
      last_transaction: new Date('2/25/2002'),
    },
  ]);

  const [newFriendName, setNewFriendName] = useState<string>('');

  const handleAddFriend = () => {
    if (newFriendName.trim() !== '') {
      const newFriend: Friend = {
        name: newFriendName,
        last_transaction: new Date(),
      };
      setFriends(prevFriends => [...prevFriends, newFriend]);
      setNewFriendName(''); // Clear the input field after adding friend
    }
  };

  const handleUnfollow = (name: string) => {
    setFriends(prevFriends => prevFriends.filter(friend => friend.name !== name));
  };

  const downloadFriends = () => {
    const logData = friends
      .map(friend => friend.name)
      .join('\n');

    const blob = new Blob([logData], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'friends.log';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div>
      <header className="friends-header">
        <div className="friends-title">My Friends</div>
        <div>
          <input
            type="text"
            placeholder="Enter friend's name"
            value={newFriendName}
            onChange={(e) => setNewFriendName(e.target.value)}
          />
          <button onClick={handleAddFriend}>Add Friend</button>
        </div>
        <Button text="Add Friend" bg_color="blue" />
        <button className="download-text" onClick={downloadFriends}>
          Download Friends
        </button>
      </header>
      <div>
        {friends.map((friend) => (
          <FriendItem
            key={friend.name}
            friend={friend}
            onUnfollow={() => handleUnfollow(friend.name)}
          />
        ))}
      </div>
    </div>
  );
}

export default Friends;
