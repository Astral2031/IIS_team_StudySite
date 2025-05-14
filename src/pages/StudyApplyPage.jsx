import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function StudyApplyPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    // 임시 프로필 정보 (나중에 로그인 정보로 대체 가능)
    const [profile] = useState({
        name: 'O O O',
        email: 'O O O@naver.com',
        phone: '010-1234-5678',
    });

    const [motivation, setMotivation] = useState('');
    const [availableTime, setAvailableTime] = useState('');
    const [experience, setExperience] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        alert(
            `스터디 ID: ${id}\n지원자: ${profile.name}\n지원동기: ${motivation}\n참여 가능 시간: ${availableTime}\n스터디 경험: ${experience}`
        );

        navigate('/study-list');
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>스터디 신청하기</h1>

            {/* 프로필 정보 표시 */}
            <div style={styles.profileBox}>
                <h2 style={styles.profileTitle}>내 프로필</h2>
                <p>이름: {profile.name}</p>
                <p>이메일: {profile.email}</p>
                <p>전화번호: {profile.phone}</p>
            </div>

            <form onSubmit={handleSubmit} style={styles.form}>
                <input
                    type="text"
                    placeholder="지원 동기"
                    value={motivation}
                    onChange={(e) => setMotivation(e.target.value)}
                    required
                    style={styles.input}
                />
                <input
                    type="text"
                    placeholder="참여 가능 시간"
                    value={availableTime}
                    onChange={(e) => setAvailableTime(e.target.value)}
                    required
                    style={styles.input}
                />
                <input
                    type="text"
                    placeholder="스터디 경험"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    required
                    style={styles.input}
                />

                <button type="submit" style={styles.button}>
                    신청하기
                </button>
            </form>
        </div>
    );
}

const styles = {
    container: {
        padding: '20px',
        maxWidth: '600px',
        margin: '40px auto',
        textAlign: 'center',
        backgroundColor: '#f9f9f9',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    },
    title: {
        fontSize: '28px',
        fontWeight: '700',
        marginBottom: '20px',
        color: '#333',
    },
    profileBox: {
        backgroundColor: '#fff',
        padding: '15px',
        borderRadius: '8px',
        marginBottom: '20px',
        textAlign: 'left',
        border: '1px solid #ddd',
    },
    profileTitle: {
        fontSize: '20px',
        fontWeight: '600',
        marginBottom: '10px',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
    },
    input: {
        padding: '10px 15px',
        fontSize: '16px',
        borderRadius: '8px',
        border: '1px solid #ddd',
    },
    button: {
        padding: '12px 20px',
        backgroundColor: '#76d7c4',
        color: '#fff',
        fontSize: '16px',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
    },
};

export default StudyApplyPage;
