import { useState } from 'react';

function StudyManagementPage() {
    const [applicants, setApplicants] = useState([
        {
            id: 1,
            name: '홍길동1',
            date: '2025-01-11',
            university: '서울대학교',
            certificates: '정보처리기사',
            message: '열심히 참여하겠습니다!',
        },
        {
            id: 2,
            name: '홍길동2',
            date: '2025-01-11',
            university: '고려대학교',
            certificates: 'SQLD',
            message: '개발 공부 열심히 할게요!',
        },
        {
            id: 3,
            name: '홍길동3',
            date: '2025-01-12',
            university: '연세대학교',
            certificates: '웹디자인기능사',
            message: '프론트엔드 쪽으로 관심 많습니다!',
        },
        {
            id: 4,
            name: '홍길동4',
            date: '2025-01-13',
            university: '성균관대학교',
            certificates: '정보처리산업기사',
            message: '스터디에서 많이 배우고 싶어요!',
        },
        {
            id: 5,
            name: '홍길동5',
            date: '2025-01-15',
            university: '한양대학교',
            certificates: 'ADsP',
            message: '백엔드 쪽 스터디 관심있어요!',
        },
    ]);

    const handleAccept = (id) => {
        const user = applicants.find(a => a.id === id);
        alert(`${user.name}님을 수락했습니다!`);
        setApplicants(applicants.filter(a => a.id !== id));
    };

    const handleReject = (id) => {
        const user = applicants.find(a => a.id === id);
        alert(`${user.name}님의 신청을 거절했습니다.`);
        setApplicants(applicants.filter(a => a.id !== id));
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>스터디 신청자 관리</h2>
            <p style={styles.subtitle}>코딩 스터디에 신청한 인원 목록입니다.</p>

            {applicants.length === 0 ? (
                <p style={styles.noApplicants}>신청자가 없습니다.</p>
            ) : (
                <ul style={styles.list}>
                    {applicants.map((applicant) => (
                        <li key={applicant.id} style={styles.listItem}>
                            <div style={styles.info}>
                                <h3 style={styles.name}>{applicant.name}</h3>
                                <p><strong>신청일:</strong> {applicant.date}</p>
                                <p><strong>대학교:</strong> {applicant.university}</p>
                                <p><strong>보유 자격증:</strong> {applicant.certificates}</p>
                                <p><strong>자기소개:</strong> {applicant.message}</p>
                            </div>
                            <div style={styles.buttonGroup}>
                                <button
                                    onClick={() => handleAccept(applicant.id)}
                                    style={styles.acceptButton}
                                >
                                    수락
                                </button>
                                <button
                                    onClick={() => handleReject(applicant.id)}
                                    style={styles.rejectButton}
                                >
                                    거절
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

const styles = {
    container: {
        maxWidth: '700px',
        margin: '50px auto',
        padding: '30px',
        border: '1px solid #ddd',
        borderRadius: '14px',
        backgroundColor: '#ffffff',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        textAlign: 'center',
    },
    title: {
        fontSize: '26px',
        marginBottom: '10px',
        color: '#333',
    },
    subtitle: {
        marginBottom: '30px',
        color: '#777',
    },
    noApplicants: {
        color: '#999',
    },
    list: {
        listStyle: 'none',
        padding: 0,
        margin: 0,
    },
    listItem: {
        padding: '20px',
        marginBottom: '20px',
        border: '1px solid #eee',
        borderRadius: '12px',
        backgroundColor: '#fafafa',
        textAlign: 'left',
    },
    info: {
        marginBottom: '16px',
    },
    name: {
        margin: '0 0 10px',
        fontSize: '20px',
        color: '#333',
    },
    buttonGroup: {
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '10px',
    },
    acceptButton: {
        padding: '8px 16px',
        backgroundColor: '#4CAF50',
        color: '#fff',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '14px',
    },
    rejectButton: {
        padding: '8px 16px',
        backgroundColor: '#f44336',
        color: '#fff',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '14px',
    },
};

export default StudyManagementPage;
