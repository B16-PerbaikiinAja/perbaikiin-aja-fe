// src/feature-4/components/TransactionHistory.js
import React from 'react';
import { formatCurrency, formatDate, getTransactionTypeStyle, getTransactionTypeLabel } from '../utils/helpers';
import { TRANSACTION_TYPE } from '../utils/constants';

const styles = {
  container: {
    marginBottom: '30px',
  },
  transactionsList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  transaction: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    padding: '15px',
    marginBottom: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    transition: 'transform 0.2s',
  },
  transactionHover: {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  },
  transactionLeft: {
    display: 'flex',
    alignItems: 'center',
  },
  iconContainer: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    marginRight: '15px',
  },
  transactionInfo: {},
  transactionTitle: {
    fontSize: '16px',
    fontWeight: '500',
    color: '#333',
    marginBottom: '4px',
  },
  transactionDate: {
    fontSize: '13px',
    color: '#777',
  },
  transactionDescription: {
    fontSize: '13px',
    color: '#555',
    marginTop: '2px',
    fontStyle: 'italic',
  },
  transactionAmount: {
    fontSize: '18px',
    fontWeight: '600',
  },
  positive: {
    color: '#28a745',
  },
  negative: {
    color: '#dc3545',
  },
  neutral: {
    color: '#6c757d',
  },
  emptyState: {
    textAlign: 'center',
    padding: '40px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
  },
  emptyStateText: {
    fontSize: '16px',
    color: '#6c757d',
  },
  paginationContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '20px',
  },
  paginationButton: {
    padding: '8px 15px',
    margin: '0 5px',
    backgroundColor: '#f8f9fa',
    border: '1px solid #ddd',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  activePaginationButton: {
    backgroundColor: '#4285f4',
    color: 'white',
    border: '1px solid #4285f4',
  },
};

const TransactionHistory = ({ transactions = [], activeTab = 'transactions' }) => {
  
  const filteredTransactions = transactions.filter(transaction => {
    if (activeTab === 'transactions') return true;
    if (activeTab === 'deposits') return transaction.type === TRANSACTION_TYPE.DEPOSIT;
    if (activeTab === 'withdrawals') return transaction.type === TRANSACTION_TYPE.WITHDRAWAL;
    return false;
  });
  
  const getAmountStyle = (type, amount) => {
    if (type === TRANSACTION_TYPE.DEPOSIT) return styles.positive;
    if (type === TRANSACTION_TYPE.WITHDRAWAL) return styles.negative;
    return styles.neutral;
  };
  
  const getAmountPrefix = (type) => {
    if (type === TRANSACTION_TYPE.DEPOSIT) return '+ ';
    if (type === TRANSACTION_TYPE.WITHDRAWAL) return '- ';
    return '';
  };
  
  if (filteredTransactions.length === 0) {
    return (
      <div style={styles.emptyState}>
        <p style={styles.emptyStateText}>No transactions found</p>
      </div>
    );
  }
  
  return (
    <div style={styles.container}>
      <ul style={styles.transactionsList}>
        {filteredTransactions.map((transaction) => {
          const typeStyle = getTransactionTypeStyle(transaction.type);
          return (
            <li 
              key={transaction.id} 
              style={styles.transaction}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = styles.transactionHover.transform;
                e.currentTarget.style.boxShadow = styles.transactionHover.boxShadow;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = styles.transaction.boxShadow;
              }}
            >
              <div style={styles.transactionLeft}>
                <div style={{
                  ...styles.iconContainer,
                  backgroundColor: `${typeStyle.color}10`,
                  color: typeStyle.color,
                }}>
                  {typeStyle.icon}
                </div>
                
                <div style={styles.transactionInfo}>
                  <div style={styles.transactionTitle}>
                    {getTransactionTypeLabel(transaction.type)}
                  </div>
                  <div style={styles.transactionDate}>
                    {formatDate(transaction.timestamp, true)}
                  </div>
                  {transaction.description && (
                    <div style={styles.transactionDescription}>
                      "{transaction.description}"
                    </div>
                  )}
                </div>
              </div>
              
              <div 
                style={{
                  ...styles.transactionAmount,
                  ...getAmountStyle(transaction.type, transaction.amount)
                }}
              >
                {getAmountPrefix(transaction.type)}
                {formatCurrency(transaction.amount)}
              </div>
            </li>
          );
        })}
      </ul>
      
      {/* For a real application, add pagination here if needed */}
    </div>
  );
};

export default TransactionHistory;
