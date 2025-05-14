import { Link } from 'react-router-dom';

function HomePage() {
  const studies = [
    { id: 1, title: 'React 초보 스터디', description: 'React 기초부터 실습까지!' },
    { id: 2, title: '알고리즘 스터디', description: '코딩 테스트 대비 알고리즘 문제 풀이' },
    { id: 3, title: 'CS 지식 스터디', description: '운영체제, 네트워크, 데이터베이스 정복' },
  ];

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>스터디 모집 플랫폼</h1>
      <p style={styles.subtitle}>함께 성장할 스터디원을 찾아보세요!</p>

      <div style={styles.studyList}>
        {studies.map((study) => (
          <div key={study.id} style={styles.card}>
            <h2 style={styles.studyTitle}>{study.title}</h2>
            <p style={styles.description}>{study.description}</p>
            <Link to={`/study/${study.id}`} style={styles.button}>자세히 보기</Link>
          </div>
        ))}
      </div>

      <button style={styles.createButton}>스터디 등록하기</button>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '30px',
    textAlign: 'center',
  },
  title: {
    fontSize: '48px',
    color: '#1e90ff',
    marginBottom: '10px',
  },
  subtitle: {
    fontSize: '18px',
    color: '#555',
    marginBottom: '40px',
  },
  studyList: {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: '40px',
  },
  card: {
    width: '280px',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    backgroundColor: '#f9f9f9',
    textAlign: 'left',
  },
  studyTitle: {
    fontSize: '22px',
    color: '#333',
    marginBottom: '10px',
  },
  description: {
    fontSize: '16px',
    color: '#666',
    marginBottom: '15px',
  },
  button: {
    display: 'inline-block',
    padding: '8px 14px',
    backgroundColor: '#1e90ff',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '6px',
  },
  createButton: {
    padding: '14px 28px',
    backgroundColor: '#1e90ff',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '18px',
    cursor: 'pointer',
  },
};

export default HomePage;
