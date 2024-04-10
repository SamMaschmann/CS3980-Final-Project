import React from 'react'
import Button from '../../components/Common/Button/Button'
import "./friends.css"
import FriendItem from '../../components/FreindItem/FriendItem'

export type Friend = {
  name: string,
  last_transaction: Date
}
function Friends() {


  const friends: Friend[] = [{
    name: "Aaron",
    last_transaction: new Date()
  }, {
    name: "Becky",
    last_transaction: new Date("1/1/1971")
  }, {
    name: "Anna",
    last_transaction: new Date("2/25/2002")
  }]
  return (
    <div>
      <header className='friends-header'>
        <div className='friends-title'>My Friends</div>
        <div></div>
        <Button text="Add Friend" bg_color='blue'/>
      </header>
    <div>
      {friends.map((f)=> (
        <FriendItem {...f}/>
      ))}
    </div>

    </div>
  )
}

export default Friends