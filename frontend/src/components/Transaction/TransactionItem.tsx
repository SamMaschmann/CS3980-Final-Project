import React from 'react';
import { Transaction } from '../../routes/transactions/transactions';
import './TransactionItem.css';

function TransactionItem({ user, other_user, amount, description }: Transaction) {
  return (
    <div className='transaction-container'>
      <div className='transaction-top'>
        <div className='transaction-party'>{other_user.username}</div>
        <div className='transaction-amount'>
          ${amount.amount_dollars}.{amount.amount_cents}
        </div>
      </div>
      <div className='transaction-bot'>{description}</div>
    </div>
  );
}

export default TransactionItem;
