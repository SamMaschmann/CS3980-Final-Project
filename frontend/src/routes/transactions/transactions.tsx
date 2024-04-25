import React, { useEffect, useState } from 'react';
import "./transactions.css";
import TransactionItem from '../../components/Transaction/TransactionItem';
import { User } from '../../global_types';
import axios from 'axios';

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

// I removed the outgoing field, think the ability to add transactions that are to you makes things confusing 
// could change user and other_user fields to "to" and "from" but I think this way simplifies things

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

    // Form state
    const [formData, setFormData] = useState<TransactionRequest>({
        other_user: "",
        amount: 0,
        description: "",
    });

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();


        await axios.post(`http://localhost:8000/payments?token=${localStorage.getItem("token")}`, formData);
        // Reset form data
        setFormData({
            other_user: "",
            amount: 0,
            description: "",
        });

        // send request to the backend 
        

    };

    // Handle form field changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    return (
        <div className="transactions-container">
            {/* Transaction list */}
            <div>
                <div className="transaction-title">Incoming</div>
                {transactions.map((t, index) => (
                    <TransactionItem key={index} {...t} />
                ))}
            </div>

            {/* Transaction form */}
            <div>
                <div className="transaction-title">Add Transaction</div>
                <form onSubmit={handleSubmit}>
                    <label>
                        Other User:
                        <input type="text" name="other_user" value={formData.other_user} onChange={handleChange} />
                    </label>
                    <br />
                    <label>
                        Amount:
                        <input type="number" name="amount" value={formData.amount} onChange={handleChange} />
                    </label>
                    <br />
                    <label>
                        Description:
                        <input type="text" name="description" value={formData.description} onChange={handleChange} />
                    </label>
                    <button type="submit">Add Transaction</button>
                </form>
            </div>
        </div>
    );
}

export default Transactions;
