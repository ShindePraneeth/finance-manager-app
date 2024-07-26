//finance-manager\client\src\components\Dashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaSignOutAlt } from 'react-icons/fa';
import { FcFullTrash } from "react-icons/fc";
import { FcAddDatabase } from "react-icons/fc";
import { LiaEdit } from "react-icons/lia";
import { FcHome, FcDocument } from "react-icons/fc";
import { Container, NavIcon, Header, Title, tableHeaderStyle, tableCellStyle, iconStyle } from '../styles';
function Dashboard() {
    const [showAllTransactions, setShowAllTransactions] = useState(false);
    const [transactions, setTransactions] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            const response = await axios.get('http://localhost:3001/transactions', {
                headers: { Authorization: localStorage.getItem('token') }
            });
            setTransactions(response.data);
        } catch (error) {
            console.error('Error fetching transactions:', error);
            if (error.response && error.response.status === 403) {
                localStorage.removeItem('token');
                navigate('/');
            }
        }
    };
    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:3001/transactions/${id}`, {
                headers: { Authorization: localStorage.getItem('token') }
            });
            setTransactions(transactions.filter(t => t.id !== id));
        } catch (error) {
            console.error('Error deleting transaction:', error);
            if (error.response && error.response.status === 403) {
                localStorage.removeItem('token');
                navigate('/');
            }
        }
    };

    const handleEdit = (id) => {
        navigate(`/edit-transaction/${id}`);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };
    const incomeTransactions = transactions.filter(t =>
        (t.type || t.category || '').toLowerCase() === 'income'
    );
    const expenseTransactions = transactions.filter(t =>
        (t.type || t.category || '').toLowerCase() === 'expense'
    );

    const TransactionList = ({ transactions, title }) => (
        <Container>
            <Title>{title}</Title>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th style={tableHeaderStyle}>Description</th>
                        <th style={tableHeaderStyle}>Amount</th>
                        <th style={tableHeaderStyle}>Date</th>
                        <th style={tableHeaderStyle}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map(transaction => (
                        <tr key={transaction.id}>
                            <td style={tableCellStyle}>{transaction.description}</td>
                            <td style={tableCellStyle}>${transaction.amount}</td>
                            <td style={tableCellStyle}>{transaction.date}</td>
                            <td style={tableCellStyle}>
                                <LiaEdit onClick={() => handleEdit(transaction.id)} style={iconStyle} />
                                <FcFullTrash onClick={() => handleDelete(transaction.id)} style={iconStyle} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Container>
    );
    const AllTransactionsList = () => (
        <Container>
            
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th style={tableHeaderStyle}>Description</th>
                        <th style={tableHeaderStyle}>Amount</th>
                        <th style={tableHeaderStyle}>Date</th>
                        <th style={tableHeaderStyle}>Type</th>
                        <th style={tableHeaderStyle}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map(transaction => (
                        <tr key={transaction.id}>
                            <td style={tableCellStyle}>{transaction.description}</td>
                            <td style={tableCellStyle}>${transaction.amount}</td>
                            <td style={tableCellStyle}>{transaction.date}</td>
                            <td style={tableCellStyle}>{transaction.type || transaction.category}</td>
                            <td style={tableCellStyle}>
                                <LiaEdit onClick={() => handleEdit(transaction.id)} style={iconStyle} />
                                <FcFullTrash onClick={() => handleDelete(transaction.id)} style={iconStyle} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Container>
    );

    return (
        <Container>
            <Header>
                <NavIcon onClick={() => {
                    setShowAllTransactions(false);
                    navigate('/dashboard');
                }}>
                    <FcHome />
                    <span>Dashboard</span>
                </NavIcon>
                <NavIcon onClick={() => navigate('/add-transaction')}>
                    <FcAddDatabase />
                    <span>Add Transaction</span>
                </NavIcon>
                <NavIcon onClick={() => setShowAllTransactions(!showAllTransactions)}>
                    <FcDocument />
                    <span>{showAllTransactions || "Statement"}</span>
                </NavIcon>
                <NavIcon onClick={handleLogout}>
                    <FaSignOutAlt />
                    <span>Logout</span>
                </NavIcon>
            </Header>
            {showAllTransactions ? (
                <AllTransactionsList />
            ) : (
                <table style={{ width: '100%' }}>
                    <tbody>
                        <tr>
                            <td style={{ width: '50%', verticalAlign: 'top', padding: '10px' }}>
                                <TransactionList transactions={incomeTransactions} title="Income" />
                            </td>
                            <td style={{ width: '50%', verticalAlign: 'top', padding: '10px' }}>
                                <TransactionList transactions={expenseTransactions} title="Expenses" />
                            </td>
                        </tr>
                    </tbody>
                </table>
            )}
        </Container>
    );
}

export default Dashboard;