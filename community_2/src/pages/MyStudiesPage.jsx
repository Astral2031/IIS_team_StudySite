import { useState } from 'react';

function MyStudiesPage() {
    const [studies] = useState([
        { id: 1, title: 'React 스터디', members: 5, startDate: '2025-01-02' },
        { id: 2, title: 'Node.js 심화', members: 3, startDate: '2025-01-04' },
        { id: 3, title: '데이터베이스 마스터', members: 4, startDate: '2025-02-15' },
        { id: 4, title: '웹 개발 스터디', members: 6, startDate: '2025-03-10' },
    ]);

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>📚 내 스터디 리스트</h2>

            <div style={styles.studyList}>
                {studies.map((study) => (
                    <div key={study.id} style={styles.card}>
                        <h3 style={styles.cardTitle}>{study.title}</h3>
                        <p style={styles.cardText}>인원수: <strong>{study.members}명</strong></p>
                        <p style={styles.cardText}>시작일: {study.startDate}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

const styles = {
    container: {
        maxWidth: '900px',
        margin: '50px auto',
        padding: '30px',
        backgroundColor: '#fff',
        borderRadius: '14px',
        boxShadow: '0 6px 18px rgba(0,0,0,0.05)',
    },
    title: {
        fontSize: '30px',
        marginBottom: '28px',
        color: '#2c3e50', // 다크 네이비로 안정감
        textAlign: 'center',
    },
    studyList: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px',
    },
    card: {
        padding: '20px',
        backgroundColor: '#ecf0f1', // 밝은 회색 계열
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    },
    cardTitle: {
        fontSize: '20px',
        marginBottom: '12px',
        color: '#3498db', // 부드러운 파란색
    },
    cardText: {
        fontSize: '16px',
        marginBottom: '8px',
        color: '#7f8c8d', // 회색 글씨
    },
};

export default MyStudiesPage;
