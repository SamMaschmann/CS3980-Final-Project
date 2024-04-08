import React from 'react'
import { Transaction } from '../../routes/transactions/transactions'
import "./TransactionItem.css"

function TransactionItem({otherParty, amount, description}: Transaction) {
  return (
    <div className='transaction-container'>
        <div className='transaction-top'>
            <div className='transaction-party'>{otherParty}</div>
            <div />
            <div className='transaction-amount'>${amount}</div>
        </div>
        <div className='transaction-bot'>
            {description}
        </div>
    </div>
  )
}

export default TransactionItem