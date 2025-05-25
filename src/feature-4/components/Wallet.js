// src/feature-4/components/Wallet.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../auth/context/AuthContext';
import DashboardNavbar from '../../components/DashboardNavbar';
import DepositForm from './DepositForm';
import WithdrawForm from './WithdrawForm';
import TransactionHistory from './TransactionHistory';
import walletService from '../services/walletService';
import { formatCurrency } from '../utils/helpers';
import authService from '../../auth/services/authService';

const styles = {
  container: {
    fontFamily: 'Poppins, sans-serif',
  },
  content: {
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    flexWrap: 'wrap',
    gap: '15px',
  },
  title: {
    fontSize: '28px',
    fontWeight: '600',
    color: '#333',
    margin: 0,
  },
  walletCard: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '25px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
    marginBottom: '30px',
  },
  balanceRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '5px',
  },
  balanceLabel: {
    fontSize: '16px',
    fontWeight: '500',
    color: '#666',
  },
  balance: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#333',
  },
  walletId: {
    fontSize: '14px',
    color: '#777',
  },
  walletStatus: {
    display: 'inline-block',
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '500',
    backgroundColor: '#d4edda',
    color: '#155724',
    marginTop: '10px',
  },
  actionButtons: {
    display: 'flex',
    gap: '15px',
    marginTop: '20px',
  },
  actionButton: {
    padding: '10px 20px',
    backgroundColor: '#4285f4',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    fontSize: '15px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    flex: '1',
    maxWidth: '200px',
  },
  withdrawButton: {
    backgroundColor: '#6c757d',
  },
  sectionTitle: {
    fontSize: '22px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '20px',
    marginTop: '30px',
  },
  tabs: {
    display: 'flex',
    borderBottom: '1px solid #ddd',
    marginBottom: '20px',
  },
  tab: {
    padding: '10px 20px',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'pointer',
    borderBottom: '3px solid transparent',
  },
  activeTab: {
    borderBottomColor: '#4285f4',
    color: '#4285f4',
  },
  notification: {
    padding: '15px',
    borderRadius: '6px',
    marginBottom: '20px',
    fontWeight: '500',
  },
  successNotification: {
    backgroundColor: '#d4edda',
    color: '#155724',
    border: '1px solid #c3e6cb',
  },
  errorNotification: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    border: '1px solid #f5c6cb',
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '300px',
    fontSize: '16px',
    color: '#666',
  },
};

const Wallet = () => {
  const { user } = useAuth();
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notification, setNotification] = useState({ type: '', message: '' });
  const [activeTab, setActiveTab] = useState('transactions');
  const [showDepositForm, setShowDepositForm] = useState(false);
  const [showWithdrawForm, setShowWithdrawForm] = useState(false);

  useEffect(() => {
    fetchWalletData();
  }, []);

  const fetchWalletData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const token = authService.getToken();
      const walletData = await walletService.getWallet(token);
      setWallet(walletData);
      
      const transactionsData = await walletService.getTransactionHistory(token);
      setTransactions(transactionsData.transactions || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch wallet data');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification({ type: '', message: '' }), 5000);
  };

  const handleDeposit = async (amount, description) => {
    try {
      setLoading(true);
      const token = authService.getToken();
      await walletService.deposit(amount, description, token);
      
      // Refresh wallet data
      await fetchWalletData();
      
      setShowDepositForm(false);
      showNotification('success', `Successfully deposited ${formatCurrency(amount)}`);
    } catch (err) {
      showNotification('error', err.message || 'Failed to process deposit');
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (amount, description) => {
    try {
      setLoading(true);
      const token = authService.getToken();
      await walletService.withdraw(amount, description, token);
      
      // Refresh wallet data
      await fetchWalletData();
      
      setShowWithdrawForm(false);
      showNotification('success', `Successfully withdrew ${formatCurrency(amount)}`);
    } catch (err) {
      showNotification('error', err.message || 'Failed to process withdrawal');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !wallet) {
    return (
      <div style={styles.container}>
        <DashboardNavbar />
        <div style={styles.content}>
          <div style={styles.loadingContainer}>
            Loading your wallet...
          </div>
        </div>
      </div>
    );
  }

  // Handle case where user doesn't have a wallet
  if (!loading && !wallet && !error) {
    return (
      <div style={styles.container}>
        <DashboardNavbar />
        <div style={styles.content}>
          <div style={styles.header}>
            <h1 style={styles.title}>My Wallet</h1>
          </div>
          <div style={{...styles.notification, ...styles.errorNotification}}>
            You don't have a wallet yet. Please contact support to set up your wallet.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <DashboardNavbar />
      <div style={styles.content}>
        <div style={styles.header}>
          <h1 style={styles.title}>My Wallet</h1>
        </div>
        
        {notification.message && (
          <div 
            style={{
              ...styles.notification, 
              ...(notification.type === 'success' ? styles.successNotification : styles.errorNotification)
            }}
          >
            {notification.message}
          </div>
        )}
        
        {error && (
          <div style={{...styles.notification, ...styles.errorNotification}}>
            {error}
          </div>
        )}
        
        {wallet && (
          <div style={styles.walletCard}>
            <div style={styles.balanceRow}>
              <span style={styles.balanceLabel}>Current Balance</span>
              <span style={styles.balance}>{formatCurrency(wallet.balance)}</span>
            </div>
            <div style={styles.walletId}>Wallet ID: {wallet.id}</div>
            <div style={styles.walletStatus}>Active</div>
            
            <div style={styles.actionButtons}>
              <button 
                style={styles.actionButton} 
                onClick={() => {
                  setShowDepositForm(true);
                  setShowWithdrawForm(false);
                }}
              >
                Deposit
              </button>
              <button 
                style={{...styles.actionButton, ...styles.withdrawButton}} 
                onClick={() => {
                  setShowWithdrawForm(true);
                  setShowDepositForm(false);
                }}
                disabled={!wallet.balance || wallet.balance <= 0}
              >
                Withdraw
              </button>
            </div>
          </div>
        )}
        
        {showDepositForm && (
          <DepositForm 
            onDeposit={handleDeposit}
            onCancel={() => setShowDepositForm(false)}
            isLoading={loading}
          />
        )}
        
        {showWithdrawForm && (
          <WithdrawForm 
            onWithdraw={handleWithdraw}
            onCancel={() => setShowWithdrawForm(false)}
            isLoading={loading}
            maxAmount={wallet ? wallet.balance : 0}
          />
        )}
        
        <h2 style={styles.sectionTitle}>Transaction History</h2>
        
        <div style={styles.tabs}>
          <div 
            style={{
              ...styles.tab, 
              ...(activeTab === 'transactions' ? styles.activeTab : {})
            }}
            onClick={() => setActiveTab('transactions')}
          >
            All Transactions
          </div>
          <div 
            style={{
              ...styles.tab, 
              ...(activeTab === 'deposits' ? styles.activeTab : {})
            }}
            onClick={() => setActiveTab('deposits')}
          >
            Deposits
          </div>
          <div 
            style={{
              ...styles.tab, 
              ...(activeTab === 'withdrawals' ? styles.activeTab : {})
            }}
            onClick={() => setActiveTab('withdrawals')}
          >
            Withdrawals
          </div>
        </div>
        
        <TransactionHistory 
          transactions={transactions} 
          activeTab={activeTab}
        />
      </div>
    </div>
  );
};

export default Wallet;
