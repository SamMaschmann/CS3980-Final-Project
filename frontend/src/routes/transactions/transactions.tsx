import React, { useEffect, useState } from 'react';
import "./transactions.css";
import TransactionItem from '../../components/Transaction/TransactionItem';
import { User } from '../../global_types';
import axios from 'axios';
import { useAppSelector } from '../../store/hooks';

export type Transaction = {
    user: string;
    other_user: string;
    amount: number;
    description?: string;
    outgoing: boolean;
};

export type TransactionRequest = {
    other_user: string,
    amount: number,
    description?: string
}


function Transactions() {
    // Simulated transaction data
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    // fetch transactions 
    useEffect(()=> {
        async function fetchTransactions() {

            const res = await axios.get(`http://localhost:8000/payments?token=${localStorage.getItem("token")}`)

            const data = await res.data

            setTransactions(data)
        }

        fetchTransactions()
    }, [])

    const stateUser = useAppSelector((state)=> state.auth.user)


    const incoming = transactions.filter((t)=> t.other_user == "jrenning")
    const outgoing = transactions.filter((t)=> t.user == "jrenning")

    return (
      <div className="transactions-container">
        {/* Transaction list */}
        <div>
          <div className="transaction-title">Incoming</div>
          {incoming.map((t, index) => (
            <TransactionItem key={index} transaction={t} type='Incoming' />
          ))}
        </div>
        <div>
          <div className="transaction-title">Outgoing</div>
          {outgoing.map((t, index) => (
            <TransactionItem key={index} transaction={t} type="Outgoing" />
          ))}
        </div>
      </div>
    );
}

export default Transactions;
