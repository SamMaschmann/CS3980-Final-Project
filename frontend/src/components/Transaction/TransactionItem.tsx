import React from 'react';
import { Transaction } from '../../routes/transactions/transactions';
import './TransactionItem.css';

type Props = {
  transaction: Transaction,
  type: "Incoming" | "Outgoing"
}

function TransactionItem({ transaction, type }: Props) {
  return (
    <div className='transaction-container'>
      <div className='transaction-top'>
        <div className='transaction-party'> {type == "Outgoing" ? `To: ${transaction.other_user}` : `From: ${transaction.user}`}</div>
        <div className='transaction-amount'>
          ${transaction.amount}
        </div>
      </div>
      <div className='transaction-bot'>{transaction.description}</div>
    </div>
  );
}

export default TransactionItem;
