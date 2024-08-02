import React, { useState, useEffect } from 'react';
import { useQuery, gql, useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { FaSignOutAlt } from 'react-icons/fa';
import { LiaEdit } from "react-icons/lia";
import { FcHome, FcDocument, FcAddDatabase, FcFullTrash } from "react-icons/fc";
import { Container, NavIcon, Header, Title, tableHeaderStyle, tableCellStyle, iconStyle, Select } from '../styles';

export const GET_TRANSACTIONS = gql`
  query GetTransactions {
    getTransactions {
      id
      description
      amount
      category
      date
    }
  }
`;

export const DELETE_TRANSACTION = gql`
  mutation DeleteTransaction($id: ID!) {
    deleteTransaction(id: $id)
  }
`;

function Dashboard() {
    const [showAllTransactions, setShowAllTransactions] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const navigate = useNavigate();
    const { loading, error, data, refetch } = useQuery(GET_TRANSACTIONS);
    const [deleteTransaction] = useMutation(DELETE_TRANSACTION);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/');
        }
        refetch().catch(err => console.error('Error refetching data:', err));
    }, [navigate, refetch]);

    const handleMonthChange = (event) => {
        setSelectedMonth(event.target.value);
    };

    const handleYearChange = (event) => {
        setSelectedYear(event.target.value);
    };

    const handleDelete = async (id, description, amount, date) => {
        const confirmMessage = `Are you sure you want to delete this transaction?\n\nDescription: ${description}\nAmount: $${amount}\nDate: ${date}`;
        const isConfirmed = window.confirm(confirmMessage);
        if (isConfirmed) {
            try {
                await deleteTransaction({
                    variables: { id },
                });
                refetch();
            } catch (error) {
                console.error('Error deleting transaction:', error);
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

    const filterTransactions = (transactions) => {
        return transactions.filter(transaction => {
            const transactionDate = new Date(transaction.date);
            const monthMatch = !selectedMonth || transactionDate.getMonth() === parseInt(selectedMonth);
            const yearMatch = !selectedYear || transactionDate.getFullYear() === parseInt(selectedYear);
            return monthMatch && yearMatch;
        });
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    const filteredTransactions = filterTransactions(data.getTransactions);
    const incomeTransactions = filteredTransactions.filter(t => (t.category || '').toLowerCase() === 'income');
    const expenseTransactions = filteredTransactions.filter(t => (t.category || '').toLowerCase() === 'expense');

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
                                <FcFullTrash onClick={() => handleDelete(transaction.id, transaction.description, transaction.amount, transaction.date)} style={iconStyle} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div style={{ textAlign: 'right', marginTop: '10px', fontWeight: 'bold', padding: '5px', backgroundColor: '#f0f0f0', borderRadius: '5px' }}>
                Total {title}: ${calculateTotal(transactions)}
            </div>
        </Container>
    );

    const calculateTotal = (transactions) => {
        return transactions.reduce((sum, transaction) => sum + parseFloat(transaction.amount), 0).toFixed(2);
    };

    const calculateFinalBalance = () => {
        const totalIncome = calculateTotal(incomeTransactions);
        const totalExpenses = calculateTotal(expenseTransactions);
        return (parseFloat(totalIncome) - parseFloat(totalExpenses)).toFixed(2);
    };

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

    const AllTransactionsList = () => (
        <Container>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th style={tableHeaderStyle}>Description</th>
                        <th style={tableHeaderStyle}>Amount</th>
                        <th style={tableHeaderStyle}>Date</th>
                        <th style={tableHeaderStyle}>Category</th>
                        <th style={tableHeaderStyle}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredTransactions.map(transaction => (
                        <tr key={transaction.id}>
                            <td style={tableCellStyle}>{transaction.description}</td>
                            <td style={tableCellStyle}>${transaction.amount}</td>
                            <td style={tableCellStyle}>{transaction.date}</td>
                            <td style={tableCellStyle}>{transaction.category}</td>
                            <td style={tableCellStyle}>
                                <LiaEdit onClick={() => handleEdit(transaction.id)} style={iconStyle} />
                                <FcFullTrash onClick={() => handleDelete(transaction.id, transaction.description, transaction.amount, transaction.date)} style={iconStyle} />
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
                }} data-testid="home-icon">
                    <FcHome />
                    <span>Dashboard</span>
                </NavIcon>
                <NavIcon onClick={() => navigate('/add-transaction')} data-testid="add-icon">
                    <FcAddDatabase />
                    <span>Add Transaction</span>
                </NavIcon>
                <NavIcon onClick={() => setShowAllTransactions(true)} data-testid="statement-icon">
                    <FcDocument />
                    <span>Statement</span>
                </NavIcon>
                <NavIcon onClick={handleLogout} data-testid="logout-icon">
                    <FaSignOutAlt />
                    <span>Logout</span>
                </NavIcon>
            </Header>
            <div style={{ marginTop: '60px', marginBottom: '20px', padding: '2.5px', backgroundColor: '#f0f0f0', borderRadius: '5px' }}>
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
                    <div style={{ textAlign: 'center', marginTop: '20px', fontWeight: 'bold', padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '5px' }}>
                        Final Balance: ${calculateFinalBalance()}
                    </div>
                </>
            )}
        </Container>
    );
}

export default Dashboard;
