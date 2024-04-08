import React from 'react'
import "./transactions.css"
import Transaction from '../../components/Transaction/TransactionItem'
import TransactionItem from '../../components/Transaction/TransactionItem'

export type Transaction = {
    otherParty: string,
    amount: number,
    type: "Incoming" | "Outgoing"
    description: string
}

function Transactions() {

const testTransactions: Transaction[] = [{
    otherParty: "Daniel",
    amount: 100,
    type: "Incoming",
    description: "This is for food"
}, {
    otherParty: "Tom",
    amount: 200,
    type: "Outgoing",
    description: "This is for the game"
}, {
    otherParty: "Linda",
    amount: 10,
    type: "Incoming",
    description: "👏"
}]

const incoming = testTransactions.filter((t)=> t.type == "Incoming")
const outgoing = testTransactions.filter((t) => t.type == "Outgoing");



  return (
    <div className="transactions-container">
      <div>
        <div className="transaction-title">Incoming</div>
        {incoming.map((t) => (
          <TransactionItem {...t} />
        ))}
      </div>

      <div>
        <div className="transaction-title">Outgoing</div>
        {outgoing.map((t) => (
          <TransactionItem {...t} />
        ))}
      </div>
    </div>
  );
}

export default Transactions