import { useState } from 'react';

function ProfileSettingsPage() {
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const [showProfileForm, setShowProfileForm] = useState(false);
    const [university, setUniversity] = useState('');
    const [certificates, setCertificates] = useState('');

    const togglePasswordForm = () => {
        setShowPasswordForm(!showPasswordForm);
    };

    const toggleProfileForm = () => {
        setShowProfileForm(!showProfileForm);
    };

    const handlePasswordChange = (e) => {
        e.preventDefault();
        alert(`비밀번호가 ${newPassword}로 변경되었습니다!`);
        setPassword('');
        setNewPassword('');
        setShowPasswordForm(false);
    };

    const handleProfileChange = (e) => {
        e.preventDefault();
        alert(`학교: ${university}, 자격증: ${certificates}로 저장되었습니다!`);
        setUniversity('');
        setCertificates('');
        setShowProfileForm(false);
    };

    const handleAccountDelete = () => {
        const confirmDelete = window.confirm("정말로 계정을 탈퇴하시겠습니까?");
        if (confirmDelete) {
            alert("계정이 탈퇴되었습니다.");
        }
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>⚙️ 계정 설정</h1>

            {/* 내 정보 수정 버튼 */}
            <button onClick={toggleProfileForm} style={styles.button}>
                📝 내 정보 수정
            </button>

            {showProfileForm && (
                <form onSubmit={handleProfileChange} style={styles.form}>
                    <label style={styles.label}>학교</label>
                    <input
                        type="text"
                        value={university}
                        onChange={(e) => setUniversity(e.target.value)}
                        style={styles.input}
                        placeholder="학교 입력"
                    />

                    <label style={styles.label}>보유 자격증</label>
                    <input
                        type="text"
                        value={certificates}
                        onChange={(e) => setCertificates(e.target.value)}
                        style={styles.input}
                        placeholder="자격증 입력"
                    />

                    <button type="submit" style={{ ...styles.button, backgroundColor: '#5dade2' }}>
                        정보 저장하기
                    </button>
                </form>
            )}

            {/* 비밀번호 변경 버튼 */}
            <button onClick={togglePasswordForm} style={{ ...styles.button, backgroundColor: '#3498db' }}>
                🔒 비밀번호 변경
            </button>

            {showPasswordForm && (
                <form onSubmit={handlePasswordChange} style={styles.form}>
                    <label style={styles.label}>현재 비밀번호</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={styles.input}
                        placeholder="현재 비밀번호 입력"
                    />

                    <label style={styles.label}>새 비밀번호</label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        style={styles.input}
                        placeholder="새 비밀번호 입력"
                    />

                    <button type="submit" style={{ ...styles.button, backgroundColor: '#2980b9' }}>
                        비밀번호 변경하기
                    </button>
                </form>
            )}

            <button onClick={handleAccountDelete} style={styles.deleteButton}>
                ❌ 계정 탈퇴
            </button>
        </div>
    );
}

const styles = {
    container: {
        maxWidth: '480px',
        margin: '60px auto',
        padding: '35px',
        border: '1px solid #ddd',
        borderRadius: '14px',
        boxShadow: '0 6px 18px rgba(0,0,0,0.08)',
        textAlign: 'center',
        backgroundColor: '#fefefe',
    },
    title: {
        marginBottom: '28px',
        color: '#34495e',
        fontSize: '26px',
    },
    form: {
        marginTop: '20px',
        marginBottom: '30px',
        textAlign: 'left',
    },
    label: {
        display: 'block',
        margin: '10px 0 5px',
        color: '#2c3e50',
        fontSize: '15px',
    },
    input: {
        width: '100%',
        padding: '12px',
        marginBottom: '18px',
        borderRadius: '8px',
        border: '1px solid #ccc',
        fontSize: '14px',
        boxSizing: 'border-box',
    },
    button: {
        width: '100%',
        padding: '13px',
        backgroundColor: '#76d7c4',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '16px',
        marginBottom: '12px',
        transition: 'background-color 0.3s',
    },
    deleteButton: {
        width: '100%',
        padding: '13px',
        backgroundColor: '#e74c3c',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '16px',
        transition: 'background-color 0.3s',
    },
};

export default ProfileSettingsPage;
