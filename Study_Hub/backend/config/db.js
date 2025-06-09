import mysql from 'mysql2/promise';
import 'dotenv/config';

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// pool에 query 메서드 추가
pool.query = async function(sql, params = []) {
  const [rows] = await this.execute(sql, params);
  return [rows]; // authController.js에서 구조분해할당을 위해 배열로 감싸서 반환
};

// 별도 query 함수도 export (기존 코드와의 호환성을 위해)
export async function query(sql, params = []) {
  const [rows] = await pool.execute(sql, params);
  return rows;
}

export default pool;