import React, { useEffect, useState } from "react";
import Button from "../../components/Common/Button/Button";
import "./friends.css";
import FriendItem, { Friend } from "../../components/FriendItem/FriendItem";
import axios from "axios";
import { useAppSelector } from "../../store/hooks";

function Friends() {
  const [friends, setFriends] = useState<string[]>([]);

  const [users, setUsers] = useState<string[]>([]);

  const stateUser = useAppSelector((state) => state.auth.user)

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

  console.log(users)

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

  // const downloadFriends = () => {
  //   const logData = friends.map((friend) => friend).join("\n");

  //   const blob = new Blob([logData], { type: "text/plain" });
  //   const url = window.URL.createObjectURL(blob);
  //   const a = document.createElement("a");
  //   a.href = url;
  //   a.download = "friends.log";
  //   document.body.appendChild(a);
  //   a.click();
  //   document.body.removeChild(a);
  //   window.URL.revokeObjectURL(url);
  // };

  return (
    <div>
      <header className="friends-header">
        <div className="friends-title">My Friends</div>
        <div className="friend-form">
          <input
            type="text"
            className="input"
            placeholder="Enter friend's name"
            value={newFriendName}
            onChange={(e) => setNewFriendName(e.target.value)}
          />
          <div className="friend-form-button">
            <Button
              bg_color="blue"
              action={handleAddFriend}
              text="Add Friend"
            />
          </div>
        </div>
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
