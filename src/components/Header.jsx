import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // 추가

function Header() {
    const [menuVisible, setMenuVisible] = useState(false);
    const navigate = useNavigate();
    const { isLoggedIn, logout } = useAuth(); // 추가

    const toggleMenu = () => setMenuVisible(!menuVisible);

    const handleLogoClick = () => navigate('/');

    const handleLogout = () => {
        logout();
        alert('로그아웃 되었습니다!');
        setMenuVisible(false);
        navigate('/');
    };

    return (
        <div>
            <header style={styles.header}>
                <div style={styles.logoContainer} onClick={handleLogoClick}>
                    Study Hub
                </div>

                <div style={styles.profileContainer}>
                    {isLoggedIn ? (
                        <div style={{ position: 'relative' }}>
                            <img
                                src="/public/profile.jpg"
                                alt="Profile"
                                style={styles.profileImg}
                                onClick={toggleMenu}
                            />
                            {menuVisible && (
                                <div style={styles.profileMenu}>
                                    <Link to="/profile-settings" style={styles.menuItem}>⚙️ 계정 설정</Link>
                                    <Link to="/community" style={styles.menuItem}>💬 커뮤니티 활동</Link>
                                    <Link to="/my-studies" style={styles.menuItem}>📚 스터디 활동</Link>
                                    <Link to="/study-management" style={styles.menuItem}>📝 스터디 관리</Link>
                                    <button onClick={handleLogout} style={styles.logoutButton}>로그아웃</button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <button onClick={() => navigate('/login')} style={styles.loginButton}>로그인</button>
                    )}
                </div>
            </header>

            <div style={styles.underline}></div>

            <nav style={styles.nav}>
                <Link to="/my-studies" style={styles.navItem}>📖 List</Link>
                <Link to="/community" style={styles.navItem}>💬 Community</Link>
                <Link to="/study-list" style={styles.navItem}>📚 Study</Link>
            </nav>
        </div>
    );
}

const styles = {
    header: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '18px 28px',
        background: 'linear-gradient(90deg, #f0f4f8 0%, #d9e7ff 100%)',
        color: '#333',
        position: 'relative',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    },
    logoContainer: {
        fontSize: '26px',
        fontWeight: '700',
        cursor: 'pointer',
        userSelect: 'none',
    },
    profileContainer: {
        position: 'absolute',
        right: '28px',
    },
    profileImg: {
        width: '42px',
        height: '42px',
        borderRadius: '50%',
        cursor: 'pointer',
        border: '2px solid #fff',
    },
    profileMenu: {
        position: 'absolute',
        top: '55px',
        right: '0',
        backgroundColor: '#fff',
        border: '1px solid #ddd',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 6px 18px rgba(0,0,0,0.2)',
        minWidth: '180px',
        zIndex: 1000,
    },
    menuItem: {
        display: 'block',
        padding: '14px 18px',
        color: '#333',
        textDecoration: 'none',
        fontSize: '15px',
        borderBottom: '1px solid #f0f0f0',
    },
    logoutButton: {
        display: 'block',
        width: 'calc(100% - 36px)',
        margin: '10px auto 14px',
        padding: '10px',
        backgroundColor: '#f8f8f8',
        border: '1px solid #ccc',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '15px',
        color: '#333',
    },
    loginButton: {
        padding: '10px 20px',
        backgroundColor: '#fff',
        border: '1px solid #ccc',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '15px',
        color: '#333',
    },
    underline: {
        height: '2px',
        backgroundColor: '#ddd',
        margin: '0',
    },
    nav: {
        display: 'flex',
        justifyContent: 'center',
        gap: '40px',
        padding: '14px 0',
        backgroundColor: '#fafafa',
        borderBottom: '1px solid #eee',
    },
    navItem: {
        fontSize: '17px',
        color: '#333',
        textDecoration: 'none',
        fontWeight: '500',
        cursor: 'pointer',
    },
};

export default Header;
