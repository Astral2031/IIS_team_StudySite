import { useState } from 'react';

function CommunityPage() {
  const [posts] = useState([
    { id: 1, title: '스터디 모집합니다! (React 초보 환영)', date: '2025-01-02' },
    { id: 2, title: 'Node.js 강의 같이 들으실 분?', date: '2025-01-02' },
  ]);

  const [comments] = useState([
    { id: 1, content: '저 참여하고 싶습니다!', date: '2025-01-03' },
    { id: 2, content: '좋은 정보 감사합니다!', date: '2025-02-01' },
  ]);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>📣 커뮤니티 활동</h2>

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>📝 내가 쓴 글</h3>
        {posts.map((post) => (
          <div key={post.id} style={styles.card}>
            <h4 style={styles.cardTitle}>{post.title}</h4>
            <p style={styles.cardDate}>{post.date}</p>
          </div>
        ))}
      </div>

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>💬 내가 쓴 댓글</h3>
        {comments.map((comment) => (
          <div key={comment.id} style={styles.card}>
            <p style={styles.cardContent}>{comment.content}</p>
            <p style={styles.cardDate}>{comment.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '800px',
    margin: '50px auto',
    padding: '30px',
    backgroundColor: '#fdfefe',
    borderRadius: '14px',
    boxShadow: '0 6px 18px rgba(0,0,0,0.08)',
  },
  title: {
    fontSize: '30px',
    marginBottom: '28px',
    color: '#34495e',
    textAlign: 'center',
  },
  section: {
    marginBottom: '40px',
  },
  sectionTitle: {
    fontSize: '22px',
    marginBottom: '18px',
    color: '#2c3e50',
    borderBottom: '2px solid #ecf0f1',
    paddingBottom: '6px',
  },
  card: {
    padding: '18px',
    marginBottom: '16px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #e8f8f5 0%, #d1f2eb 100%)',
    boxShadow: '0 3px 8px rgba(0,0,0,0.05)',
  },
  cardTitle: {
    fontSize: '18px',
    marginBottom: '6px',
    color: '#1abc9c',
  },
  cardContent: {
    fontSize: '16px',
    marginBottom: '6px',
    color: '#34495e',
  },
  cardDate: {
    fontSize: '14px',
    color: '#7f8c8d',
  },
};

export default CommunityPage;
