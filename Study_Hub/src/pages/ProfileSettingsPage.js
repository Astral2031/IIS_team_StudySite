import { useState, useEffect } from 'react';
import { authService } from '../services/authService.js';

function ProfileSettingsPage() {
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const [showProfileForm, setShowProfileForm] = useState(false);

    // 기존 정보
    const [name, setName] = useState('홍길동');
    const [university, setUniversity] = useState('경성대학교');
    const [certificates, setCertificates] = useState('정보처리기사');

    // 새로 추가한 정보
    const [age, setAge] = useState('24');
    const [gender, setGender] = useState('남성');
    const [location, setLocation] = useState('부산');
    const [phone, setPhone] = useState('010-1234-5678');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const profile = await authService.getProfile(); // getProfile 함수 호출
                setName(profile.name || '');
                setUniversity(profile.university || '');
                setCertificates(profile.certificates || '');
                setAge(profile.age || '');
                setGender(profile.gender || '');
                setLocation(profile.location || '');
                setPhone(profile.phone || '');
            } catch (err) {
                console.error("프로필 정보를 불러오는데 실패했습니다.", err);
                alert("프로필 정보를 불러올 수 없습니다.");
            }
        };

        fetchProfile();
    }, []);

    const togglePasswordForm = () => {
        setShowPasswordForm(!showPasswordForm);
    };

    const toggleProfileForm = () => {
        setShowProfileForm(!showProfileForm);
    };

    const handleDelete = async () => {
        const confirmDelete = window.confirm("정말 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.");
        if (!confirmDelete) return;

        try {
            await authService.deleteAccount();
            localStorage.removeItem("token"); // 토큰 삭제
            authService.logout();
            alert("계정이 삭제되었습니다.");
            window.location.href = "/signin";
        } catch (err) {
            console.error(err);
            alert("계정 삭제에 실패했습니다.");
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();

        try {
            await authService.changePassword(password, newPassword);
            alert("비밀번호가 성공적으로 변경되었습니다.");
            setPassword("");
            setNewPassword("");
            setShowPasswordForm(false);
        } catch (error) {
            alert(error.message);
        }
    };

    const handleProfileChange = (e) => {
        e.preventDefault();
        alert(`이름: ${name}, 학교: ${university}, 자격증: ${certificates}, 나이: ${age}, 성별: ${gender}, 지역: ${location}, 번호: ${phone}로 저장되었습니다!`);
        setShowProfileForm(false);
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>⚙️ 계정 설정</h1>

            {/* 내 정보 표시 영역 */}
            <div style={styles.profileBox}>
                <h3 style={styles.profileTitle}>📋 내 정보</h3>
                <p><strong>이름:</strong> {name}</p>
                <p><strong>학교:</strong> {university}</p>
                <p><strong>자격증:</strong> {certificates}</p>
                <p><strong>나이:</strong> {age}</p>
                <p><strong>성별:</strong> {gender}</p>
                <p><strong>지역:</strong> {location}</p>
                <p><strong>번호:</strong> {phone}</p>
            </div>

            {/* 내 정보 수정 버튼 */}
            <button onClick={toggleProfileForm} style={styles.button}>
                📝 내 정보 수정
            </button>

            {showProfileForm && (
                <form onSubmit={handleProfileChange} style={styles.form}>
                    <label style={styles.label}>이름</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={styles.input}
                        placeholder="이름 입력"
                    />

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

                    <label style={styles.label}>나이</label>
                    <input
                        type="number"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        style={styles.input}
                        placeholder="나이 입력"
                        min="0"
                    />

                    <label style={styles.label}>성별</label>
                    <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        style={{ ...styles.input, padding: '12px' }}
                    >
                        <option value="남성">남성</option>
                        <option value="여성">여성</option>
                        <option value="기타">기타</option>
                    </select>

                    <label style={styles.label}>지역</label>
                    <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        style={styles.input}
                        placeholder="지역 입력"
                    />

                    <label style={styles.label}>전화번호</label>
                    <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        style={styles.input}
                        placeholder="전화번호 입력"
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

            <button onClick={handleDelete} style={styles.deleteButton}>
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
    profileBox: {
        textAlign: 'left',
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: '10px',
        marginBottom: '25px',
        backgroundColor: '#f9f9f9',
    },
    profileTitle: {
        marginBottom: '15px',
        fontSize: '18px',
        color: '#2c3e50',
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
