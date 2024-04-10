import React from 'react'
import Button from '../../components/Common/Button/Button';

function Dashboard() {
  return (
    <div>
      <a href="/login">
        <Button text="Go to Login Page" bg_color='blue'/>
      </a>
    </div>
  );
}

export default Dashboard