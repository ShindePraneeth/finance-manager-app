//finance-manager\client\src\components\Dashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaSignOutAlt } from 'react-icons/fa';
import { LiaEdit } from "react-icons/lia";
import { FcHome, FcDocument,FcAddDatabase,FcFullTrash } from "react-icons/fc";
import { Container, NavIcon, Header, Title, tableHeaderStyle, tableCellStyle, iconStyle ,Select} from '../styles';
function Dashboard() {
    const [showAllTransactions, setShowAllTransactions] = useState(false);
    const [transactions, setTransactions] = useState([]);
    const navigate = useNavigate();
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedYear, setSelectedYear] = useState('');


    useEffect(() => {
        fetchTransactions();
    }, []);

    const handleMonthChange = (event) => {
        setSelectedMonth(event.target.value);
    };
    const handleYearChange = (event) => {
        setSelectedYear(event.target.value);
    };

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
        (t.category || '').toLowerCase() === 'income'
    );
    const expenseTransactions = transactions.filter(t =>
        ( t.category || '').toLowerCase() === 'expense'
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
            <div style={{ textAlign: 'right', marginTop: '10px', fontWeight: 'bold' }}>
            Total {title}: ${calculateTotal(transactions)}
            </div>   
        </Container>
    );


    const filterTransactionsByMonthAndYear = (transactions) => {
        return transactions.filter(transaction => {
            const transactionDate = new Date(transaction.date);
            const monthMatch = !selectedMonth || transactionDate.getMonth() === parseInt(selectedMonth);
            const yearMatch = !selectedYear || transactionDate.getFullYear() === parseInt(selectedYear);
            return monthMatch && yearMatch;
        });
    };
    const AllTransactionsList = () => {
        const filteredTransactions = filterTransactionsByMonthAndYear(transactions);
        const currentYear = new Date().getFullYear();
        const years = Array.from({length: 10}, (_, i) => currentYear - i);
    
        return (
            <Container>
                <div style={{ marginBottom: '20px' }}>
                    <label htmlFor="yearFilter">Filter by Year: </label>
                    <Select id="yearFilter" value={selectedYear} onChange={handleYearChange}>
                        <option value="">All Years</option>
                        {years.map(year => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </Select>
                    <label htmlFor="monthFilter" style={{ marginLeft: '20px' }}>Filter by Month: </label>
                    <Select id="monthFilter" value={selectedMonth} onChange={handleMonthChange}>
                        <option value="">All Months</option>
                        <option value="0">January</option>
                        <option value="1">February</option>
                        <option value="2">March</option>
                        <option value="3">April</option>
                        <option value="4">May</option>
                        <option value="5">June</option>
                        <option value="6">July</option>
                        <option value="7">August</option>
                        <option value="8">September</option>
                        <option value="9">October</option>
                        <option value="10">November</option>
                        <option value="11">December</option>
                    </Select>
                </div>
            
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                {
                <thead>
                    <tr>
                        <th style={tableHeaderStyle}>Description</th>
                        <th style={tableHeaderStyle}>Amount</th>
                        <th style={tableHeaderStyle}>Date</th>
                        <th style={tableHeaderStyle}>Category</th>
                        <th style={tableHeaderStyle}>Actions</th>
                    </tr>
                </thead>
    }
                <tbody>
                    {filteredTransactions.map(transaction => (
                        <tr key={transaction.id}>
                            <td style={tableCellStyle}>{transaction.description}</td>
                            <td style={tableCellStyle}>${transaction.amount}</td>
                            <td style={tableCellStyle}>{transaction.date}</td>
                            <td style={tableCellStyle}>{transaction.category}</td>
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

};
    
    const calculateTotal = (transactions) => {
        return transactions.reduce((sum, transaction) => sum + parseFloat(transaction.amount), 0).toFixed(2);
    };
    
    const calculateFinalBalance = () => {
        const totalIncome = calculateTotal(incomeTransactions);
        const totalExpenses = calculateTotal(expenseTransactions);
        return (parseFloat(totalIncome) - parseFloat(totalExpenses)).toFixed(2);
    };
    
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
                <NavIcon onClick={() => setShowAllTransactions(AllTransactionsList)}>
                    <FcDocument />
                    <span>Statement</span>
                </NavIcon>
                <NavIcon onClick={handleLogout}>
                    <FaSignOutAlt />
                    <span>Logout</span>
                </NavIcon>
            </Header>
            {showAllTransactions ? (
                <AllTransactionsList />
            ) : (
                <>
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
                <div style={{ textAlign: 'right', marginTop: '20px', fontWeight: 'bold', fontSize: '1.2em' }}>
                    Final Balance: ${calculateFinalBalance()}
                </div>
                </>
                )}
        </Container>
    );
}

export default Dashboard;