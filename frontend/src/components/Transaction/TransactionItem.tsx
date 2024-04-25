import React from 'react';
import { Transaction } from '../../routes/transactions/transactions';
import './TransactionItem.css';

function TransactionItem({ other_user, amount, description }: Transaction) {
  return (
    <div className='transaction-container'>
      <div className='transaction-top'>
        <div className='transaction-party'>{other_user}</div>
        <div className='transaction-amount'>
          ${amount}
        </div>
      </div>
      <div className='transaction-bot'>{description}</div>
    </div>
  );
}

export default TransactionItem;
