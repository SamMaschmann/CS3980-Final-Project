import React, { useState } from 'react';
import "./transactions.css";
import TransactionItem from '../../components/Transaction/TransactionItem';
import { User } from '../../global_types';

export type Transaction = {
    user: User;
    other_user: User;
    amount: number;
    description?: string;
    outgoing: boolean;
};

function Transactions() {
    // Simulated transaction data
    const [transactions, setTransactions] = useState<Transaction[]>([
        {
            user: { id: 1, username: "John Doe" },
            other_user: { id: 2, username: "Jane Smith" },
            amount: 50,
            description: "Payment for services",
            outgoing: true
        },
        {
            user: { id: 2, username: "Jane Smith" },
            other_user: { id: 1, username: "John Doe" },
            amount: 30,
            description: "Refund",
            outgoing: false
        }
    ]);

    // Form state
    const [formData, setFormData] = useState<Transaction>({
        user: { id: 1, username: "John Doe" },
        other_user: { id: 2, username: "" },
        amount: 0,
        description: "",
        outgoing: true
    });

    // Handle form submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setTransactions([...transactions, formData]);
        // Reset form data
        setFormData({
            user: { id: 1, username: "John Doe" },
            other_user: { id: 2, username: "" },
            amount: 0,
            description: "",
            outgoing: true
        });
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
                        <input type="text" name="other_user" value={formData.other_user.username} onChange={handleChange} />
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
                    <br />
                    <label>
                        <select name="outgoing" value={formData.outgoing.toString()} onChange={handleChange}>
                            <option value="true">Outgoing</option>
                            <option value="false">Incoming</option>
                        </select>
                    </label>
                    <br />
                    <button type="submit">Add Transaction</button>
                </form>
            </div>
        </div>
    );
}

export default Transactions;
