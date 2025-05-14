import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // 경로는 프로젝트 구조에 맞게 수정!

function LoginPage() {
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const { login } = useAuth();
    const navigate = useNavigate();

    const hardcodedUser = {
        id: 'studyUser',
        password: 'study1234'
    };

    const handleLogin = () => {
        if (!id || !password) {
            setErrorMessage('아이디와 비밀번호를 입력하세요!');
            return;
        }
        if (id === hardcodedUser.id && password === hardcodedUser.password) {
            setErrorMessage('');
            login();  // 로그인 상태 true로 변경
            alert('로그인 성공!');
            navigate('/');  // 메인 페이지로 이동
        } else {
            setErrorMessage('아이디 또는 비밀번호가 잘못되었습니다.');
        }
    };

    const handleSignup = () => {
        alert('회원가입 페이지로 이동합니다.');
    };

    const handleFindAccount = () => {
        alert('아이디/비밀번호 찾기 페이지로 이동합니다.');
    };

    const containerStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: '150px',
    };

    const boxStyle = {
        display: 'flex',
        flexDirection: 'column',
        width: '320px',
        padding: '30px',
        backgroundColor: 'white',
        borderRadius: '18px',
        boxShadow: '0 6px 25px rgba(0, 0, 0, 0.1)',
    };

    const inputStyle = {
        height: '48px',
        marginBottom: '18px',
        padding: '0 15px',
        border: '1px solid #bbdefb',
        borderRadius: '10px',
        fontSize: '15px',
    };

    const buttonStyle = {
        height: '50px',
        backgroundColor: '#1976d2',
        color: 'white',
        border: 'none',
        borderRadius: '10px',
        fontSize: '16px',
        cursor: 'pointer',
        marginBottom: '20px',
    };

    const linkGroupStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        marginBottom: '15px',
    };

    const subTextStyle = {
        fontSize: '13px',
        color: '#555',
        marginBottom: '5px',
        marginLeft: '5px',
    };

    const subButtonStyle = {
        width: '100%',
        height: '42px',
        backgroundColor: '#42a5f5',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '14px',
        cursor: 'pointer',
    };

    return (
        <div style={containerStyle}>
            <h2 style={{ color: '#0d47a1', marginBottom: '30px' }}>Study Hub</h2>
            <div style={boxStyle}>
                <input
                    type="text"
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                    placeholder="아이디"
                    style={inputStyle}
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="비밀번호"
                    style={inputStyle}
                />

                {/* 예시 계정 추가 */}
                <p style={{ fontSize: '13px', color: '#777', marginBottom: '18px', marginLeft: '5px' }}>
                    ex 👉 ID: <strong>studyUser</strong> / PW: <strong>study1234</strong>
                </p>

                <button
                    style={buttonStyle}
                    onClick={handleLogin}
                >
                    로그인
                </button>

                {errorMessage && (
                    <p style={{ color: 'red', fontSize: '14px', textAlign: 'center' }}>
                        {errorMessage}
                    </p>
                )}

                <div style={linkGroupStyle}>
                    <p style={subTextStyle}>아이디가 없으신가요?</p>
                    <button
                        style={subButtonStyle}
                        onClick={handleSignup}
                    >
                        회원가입
                    </button>
                </div>

                <div style={linkGroupStyle}>
                    <p style={subTextStyle}>아이디 또는 비밀번호를 잊어버리셨나요?</p>
                    <button
                        style={subButtonStyle}
                        onClick={handleFindAccount}
                    >
                        아이디/비밀번호 찾기
                    </button>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
