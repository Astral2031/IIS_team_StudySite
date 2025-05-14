import { useState } from 'react';

function PostStudyPage() {
    const [title, setTitle] = useState('');
    const [requirements, setRequirements] = useState('');
    const [content, setContent] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log({
            title,
            requirements,
            content
        });
        alert('스터디 모집 글이 등록되었습니다!');
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>📄 스터디 모집 글 작성</h2>
            <form onSubmit={handleSubmit} style={styles.form}>
                <label style={styles.label}>스터디 이름</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    style={styles.input}
                    required
                />

                <label style={styles.label}>자격 요건 (나이, 거주지, 참여 가능 요일)</label>
                <input
                    type="text"
                    value={requirements}
                    onChange={(e) => setRequirements(e.target.value)}
                    style={styles.input}
                    required
                />

                <label style={styles.label}>스터디 내용</label>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    style={styles.textarea}
                    required
                />

                <button type="submit" style={styles.button}>등록하기</button>
            </form>
        </div>
    );
}

const styles = {
    container: {
        padding: '20px',
        maxWidth: '600px',
        margin: '40px auto',
        backgroundColor: '#f9f9f9',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    },
    title: {
        fontSize: '24px',
        fontWeight: '700',
        marginBottom: '20px',
        color: '#333',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
    },
    label: {
        margin: '10px 0 5px',
        fontSize: '14px',
        color: '#555',
    },
    input: {
        padding: '10px',
        border: '1px solid #ddd',
        borderRadius: '8px',
    },
    textarea: {
        padding: '10px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        minHeight: '120px',
    },
    button: {
        marginTop: '20px',
        padding: '12px 20px',
        backgroundColor: '#76d7c4',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '16px',
    }
};

export default PostStudyPage;
