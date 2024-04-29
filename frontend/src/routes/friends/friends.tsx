import React, { useEffect, useState } from "react";
import Button from "../../components/Common/Button/Button";
import "./friends.css";
import FriendItem, { Friend } from "../../components/FriendItem/FriendItem";
import axios from "axios";

function Friends() {
  const [friends, setFriends] = useState<string[]>([]);

  const [user, setUsers] = useState<string[]>([]);

  useEffect(() => {
    async function fetchData() {
      const res = await axios.get(
        `http://localhost:8000/users/friends?token=${localStorage.getItem(
          "token"
        )}`
      );
      const data = await res.data;

      setFriends(data);

      const res2 = await axios.get(
        `http://localhost:8000/users?token=${localStorage.getItem("token")}`
      );
      const data2 = await res2.data;

      setUsers(data2);
    }

    fetchData();
  }, []);

  const [newFriendName, setNewFriendName] = useState<string>("");

  const handleAddFriend = async () => {
    if (newFriendName.trim() !== "") {
      // send request to backend
      await axios.post(
        `http://localhost:8000/users/friends?token=${localStorage.getItem(
          "token"
        )}`,
        {
          friend_username: newFriendName,
        }
      );

      setNewFriendName(""); // Clear the input field after adding friend

      // set in frontend to avoid reload 
      setFriends([...friends, newFriendName])
    }
  };

  console.log(friends)

  const handleUnfollow = async (name: string) => {
    // remove in backend 
    await axios.delete(
      `http://localhost:8000/users/friends?token=${localStorage.getItem(
        "token"
      )}&friend_username=${name}`,
    );
    // remove in frontend, just avoids a reload
    setFriends((prevFriends) =>
      prevFriends.filter((friend) => friend !== name)
    );
  };

  const downloadFriends = () => {
    const logData = friends.map((friend) => friend).join("\n");

    const blob = new Blob([logData], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "friends.log";
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
            key={friend}
            friend={friend}
            onUnfollow={() => handleUnfollow(friend)}
          />
        ))}
      </div>
    </div>
  );
}

export default Friends;
