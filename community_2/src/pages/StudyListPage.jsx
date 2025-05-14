import { useState } from 'react';
import { Link } from 'react-router-dom';

function StudyListPage() {
    const [studies] = useState([
        { id: 1, title: 'React 초급 스터디', subject: '프론트엔드', category: 'IT 개발', participants: 5, maxParticipants: 10 },
        { id: 2, title: 'Node.js 백엔드 스터디', subject: '백엔드', category: 'IT 개발', participants: 4, maxParticipants: 10 },
        { id: 3, title: 'Python 데이터 분석', subject: '데이터 분석', category: 'IT 개발', participants: 6, maxParticipants: 8 },
        { id: 4, title: '자바 알고리즘 스터디', subject: '알고리즘', category: 'IT 개발', participants: 3, maxParticipants: 10 },
        { id: 5, title: '영어 회화 스터디', subject: '회화', category: '언어', participants: 3, maxParticipants: 5 },
        { id: 6, title: '일본어 초급 스터디', subject: '기초 일본어', category: '언어', participants: 4, maxParticipants: 6 },
        { id: 7, title: '스페인어 문법 스터디', subject: '스페인어', category: '언어', participants: 2, maxParticipants: 5 },
        { id: 8, title: 'UI/UX 디자인 스터디', subject: '디자인', category: '디자인', participants: 4, maxParticipants: 8 },
        { id: 9, title: '웹디자인 실습 스터디', subject: '웹디자인', category: '디자인', participants: 5, maxParticipants: 7 },
        { id: 10, title: '그래픽 디자인 스터디', subject: 'Adobe Illustrator', category: '디자인', participants: 3, maxParticipants: 6 },
        { id: 11, title: '정보처리기사 시험 준비 스터디', subject: '자격증', category: '자격증', participants: 6, maxParticipants: 8 },
        { id: 12, title: '토익 점수 향상 스터디', subject: '영어 자격증', category: '자격증', participants: 2, maxParticipants: 6 },
        { id: 13, title: '토플 시험 준비 스터디', subject: '영어 자격증', category: '자격증', participants: 4, maxParticipants: 6 },
        { id: 14, title: '자기계발 독서 스터디', subject: '자기계발', category: '자기개발', participants: 5, maxParticipants: 10 },
        { id: 15, title: '심리학 공부 스터디', subject: '심리학', category: '자기개발', participants: 3, maxParticipants: 6 },
        { id: 16, title: '하버드 비즈니스 독서 스터디', subject: '비즈니스', category: '자기개발', participants: 4, maxParticipants: 5 },
    ]);

    const [selectedCategory, setSelectedCategory] = useState('전체');
    const [currentPage, setCurrentPage] = useState(1);
    const studiesPerPage = 5;

    const filteredStudies = selectedCategory === '전체'
        ? studies
        : studies.filter(study => study.category === selectedCategory);

    const totalPages = Math.ceil(filteredStudies.length / studiesPerPage);
    const startIndex = (currentPage - 1) * studiesPerPage;
    const currentStudies = filteredStudies.slice(startIndex, startIndex + studiesPerPage);

    const categories = ['전체', 'IT 개발', '언어', '디자인', '자격증', '자기개발'];

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>📚 전체 스터디 리스트</h1>

            <Link to="/post-study" style={styles.postStudyLink}>모집 글 쓰기</Link>

            <div style={styles.categoryFilter}>
                {categories.map((category) => (
                    <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        style={{
                            ...styles.categoryButton,
                            backgroundColor: selectedCategory === category ? '#76d7c4' : '#f0f0f0',
                        }}
                    >
                        {category}
                    </button>
                ))}
            </div>

            <div style={styles.studyList}>
                {currentStudies.map((study) => (
                    <div key={study.id} style={styles.studyItem}>
                        <h3 style={styles.studyTitle}>{study.title}</h3>
                        <p style={styles.studyDetail}>주제: {study.subject}</p>
                        <p style={styles.studyDetail}>참여자: {study.participants} / {study.maxParticipants}</p>

                        <div style={styles.buttonGroup}>
                            <Link to={`/study-detail/${study.id}`} style={styles.studyButton}>상세 보기</Link>
                            <Link to={`/study-apply/${study.id}`} style={styles.applyButton}>신청하기</Link>
                        </div>
                    </div>
                ))}
            </div>

            <div style={styles.pagination}>
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index + 1}
                        onClick={() => setCurrentPage(index + 1)}
                        style={styles.pageButton}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
    );
}

const styles = {
    container: {
        padding: '20px',
        maxWidth: '800px',
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
    postStudyLink: {
        display: 'inline-block',
        padding: '10px 15px',
        marginTop: '10px',
        fontSize: '16px',
        color: '#76d7c4',
        textDecoration: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
    },
    categoryFilter: {
        marginBottom: '20px',
    },
    categoryButton: {
        padding: '10px 15px',
        margin: '0 10px',
        backgroundColor: '#f0f0f0',
        border: '1px solid #ddd',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '14px',
        color: '#333',
    },
    studyList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
    },
    studyItem: {
        backgroundColor: '#fff',
        padding: '15px',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        textAlign: 'left',
        border: '1px solid #ddd',
    },
    studyTitle: {
        fontSize: '20px',
        fontWeight: '600',
        margin: '0 0 10px 0',
    },
    studyDetail: {
        fontSize: '14px',
        color: '#555',
        margin: '5px 0',
    },
    buttonGroup: {
        marginTop: '10px',
    },
    studyButton: {
        display: 'inline-block',
        padding: '10px 15px',
        marginRight: '10px',
        backgroundColor: '#76d7c4',
        color: '#fff',
        textDecoration: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
    },
    applyButton: {
        display: 'inline-block',
        padding: '10px 15px',
        backgroundColor: '#ffa07a',
        color: '#fff',
        textDecoration: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
    },
    pagination: {
        marginTop: '20px',
    },
    pageButton: {
        padding: '10px 15px',
        margin: '0 5px',
        backgroundColor: '#f0f0f0',
        border: '1px solid #ddd',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '14px',
    },
};

export default StudyListPage;
