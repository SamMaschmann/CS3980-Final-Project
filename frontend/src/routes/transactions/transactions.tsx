import React from 'react'
import "./transactions.css"
import Transaction from '../../components/Transaction/TransactionItem'
import TransactionItem from '../../components/Transaction/TransactionItem'
import {useFetchData} from "../../hooks/useFetchData"
import { Amount, User } from '../../global_types'
import Button from '../../components/Common/Button/Button'
import axios from 'axios'



export type Transaction = {
    user: User
    other_user: User
    amount: Amount
    description?: string
    outgoing: boolean
}

function Transactions() {

  const {isLoading, error, apiData} = useFetchData<Transaction>("http://localhost:8000/transactions")


  const outgoing = apiData?.filter((t)=> t.outgoing === true)
  const incoming = apiData?.filter((t)=> t.outgoing === false)

  return (
    <div className="transactions-container">
      <div>
        <div className="transaction-title">Incoming</div>
        {incoming && incoming.map((t) => (
          <TransactionItem {...t} />
        ))}
      </div>

      <div>
        <div className="transaction-title">Outgoing</div>
        {outgoing && outgoing.map((t) => (
          <TransactionItem {...t} />
        ))}
      </div>
    </div>
  );
}

export default Transactions