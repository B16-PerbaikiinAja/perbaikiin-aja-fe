// src/components/DashboardNavbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/context/AuthContext';

const styles = {
    navbar: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '15px 30px',
        backgroundColor: '#ffffff',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        fontFamily: 'Poppins, sans-serif',
    },
    logo: {
        fontWeight: '700',
        fontSize: '24px',
        color: '#4285f4',
        textDecoration: 'none',
    },
    menuContainer: {
        display: 'flex',
        gap: '30px',
        alignItems: 'center',
    },
    navItem: {
        textDecoration: 'none',
        color: '#333',
        fontWeight: '500',
        fontSize: '16px',
        transition: 'color 0.3s',
    },
    navItemHover: {
        color: '#4285f4',
    },
    userInfoContainer: {
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
    },
    userAvatar: {
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        backgroundColor: '#4285f4',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#fff',
        fontWeight: '500',
    },
    userName: {
        fontWeight: '500',
        fontSize: '16px',
    },
    userRole: {
        color: '#666',
        fontSize: '14px',
    },
    logoutButton: {
        background: 'none',
        border: 'none',
        color: '#f44336',
        fontSize: '16px',
        fontWeight: '500',
        cursor: 'pointer',
        padding: '8px 12px',
        borderRadius: '5px',
        fontFamily: 'Poppins, sans-serif',
        marginLeft: '20px',
        transition: 'background-color 0.3s',
    },
    logoutButtonHover: {
        backgroundColor: '#ffebee',
    },
};

const DashboardNavbar = () => {
    const { user, logout, isAdmin, isTechnician, isCustomer } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Get the first letter of the user's name for the avatar
    const getInitial = () => {
        if (user && user.fullName) {
            return user.fullName.charAt(0).toUpperCase();
        }
        return 'U'; // Default
    };

    // Convert role to readable format
    const getRoleDisplay = () => {
        if (isAdmin) return 'Administrator';
        if (isTechnician) return 'Technician';
        return 'Customer';
    };

    return (
        <nav style={styles.navbar}>
            <Link to="/dashboard" style={styles.logo}>
                PerbaikiinAja
            </Link>

            <div style={styles.menuContainer}>
                <Link
                    to="/dashboard"
                    style={styles.navItem}
                    onMouseOver={(e) => e.currentTarget.style.color = styles.navItemHover.color}
                    onMouseOut={(e) => e.currentTarget.style.color = styles.navItem.color}
                >
                    Dashboard
                </Link>

                {/* Technician specific navigation */}
                {isTechnician && (
                    <Link
                        to="/technician/service-requests"
                        style={styles.navItem}
                        onMouseOver={(e) => e.currentTarget.style.color = styles.navItemHover.color}
                        onMouseOut={(e) => e.currentTarget.style.color = styles.navItem.color}
                    >
                        My Requests
                    </Link>
                )}

                {/* Customer specific navigation */}
                {isCustomer && (
                    <Link
                        to="/customer/service-requests"
                        style={styles.navItem}
                        onMouseOver={(e) => e.currentTarget.style.color = styles.navItemHover.color}
                        onMouseOut={(e) => e.currentTarget.style.color = styles.navItem.color}
                    >
                        My Orders
                    </Link>
                )}

                {/* Admin specific navigation */}
                {isAdmin && (
                    <>
                        <Link
                            to="/admin/register-technician"
                            style={styles.navItem}
                            onMouseOver={(e) => e.currentTarget.style.color = styles.navItemHover.color}
                            onMouseOut={(e) => e.currentTarget.style.color = styles.navItem.color}
                        >
                            Register Technician
                        </Link>
                        <Link
                            to="/admin/reports"
                            style={styles.navItem}
                            onMouseOver={(e) => e.currentTarget.style.color = styles.navItemHover.color}
                            onMouseOut={(e) => e.currentTarget.style.color = styles.navItem.color}
                        >
                            Reports
                        </Link>
                        {/* New Admin Navbar Link for Coupons */}
                        <Link
                            to="/admin/coupons"
                            style={styles.navItem}
                            onMouseOver={(e) => e.currentTarget.style.color = styles.navItemHover.color}
                            onMouseOut={(e) => e.currentTarget.style.color = styles.navItem.color}
                        >
                            Coupons
                        </Link>
                    </>
                )}

                <div style={styles.userInfoContainer}>
                    <div style={styles.userAvatar}>
                        {getInitial()}
                    </div>
                    <div>
                        <div style={styles.userName}>{user?.fullName || 'User'}</div>
                        <div style={styles.userRole}>{getRoleDisplay()}</div>
                    </div>

                    <button
                        onClick={handleLogout}
                        style={styles.logoutButton}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = styles.logoutButtonHover.backgroundColor}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default DashboardNavbar;