import db, { query } from "../config/db.js";

export const createPost = async (req, res) => {
  const { category } = req.params;
  const { title, content, author_id } = req.body;

  if (!title || !content || !author_id) {
    return res.status(400).json({ error: "필수 데이터가 누락되었습니다." });
  }

  let tableName;
  switch (category) {
    case "notice":
      tableName = "notice_posts";
      break;
    case "freetalk":
      tableName = "free_posts";
      break;
    case "qna":
      tableName = "qna_posts";
      break;
    default:
      return res.status(400).json({ error: "올바르지 않은 카테고리입니다." });
  }

  try {
    const sql = `INSERT INTO ${tableName} (title, content, author_id) VALUES (?, ?, ?)`;
    const [result] = await db.execute(sql, [title, content, author_id]);

    return res.status(201).json({ message: "게시글 생성 성공", postId: result.insertId });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "게시글 저장 실패" });
  }
};

export const getPosts = async (req, res) => {
  const { category } = req.params;

  let tableName;
  switch (category) {
    case "notice":
      tableName = "notice_posts";
      break;
    case "freetalk":
      tableName = "free_posts";
      break;
    case "qna":
      tableName = "qna_posts";
      break;
    default:
      return res.status(400).json({ error: "올바르지 않은 카테고리입니다." });
  }

  try {
    const sql = `
      SELECT p.id, p.title, p.content, p.views, p.likes, p.created_at, u.nickname AS author, ? AS category
      FROM ${tableName} p
      JOIN users u ON p.author_id = u.id
      ORDER BY p.created_at DESC
    `;
    const [rows] = await db.execute(sql, [category]);
    return res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "게시글 불러오기 실패" });
  }
};

export const increaseViews = async (req, res) => {
  const { category, postId } = req.params;

  let tableName;
  switch (category) {
    case "notice":
      tableName = "notice_posts";
      break;
    case "freetalk":
      tableName = "free_posts";
      break;
    case "qna":
      tableName = "qna_posts";
      break;
    default:
      return res.status(400).json({ error: "올바르지 않은 카테고리입니다." });
  }

  try {
    // 조회수 1 증가
    const sql = `UPDATE ${tableName} SET views = views + 1 WHERE id = ?`;
    await db.execute(sql, [postId]);

    return res.status(200).json({ message: "조회수 증가 완료" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "조회수 증가 실패" });
  }
};

export const getPostById = async (req, res) => {
  const { category, postId } = req.params;

  let tableName;
  switch (category) {
    case "notice":
      tableName = "notice_posts";
      break;
    case "freetalk":
      tableName = "free_posts";
      break;
    case "qna":
      tableName = "qna_posts";
      break;
    default:
      return res.status(400).json({ error: "올바르지 않은 카테고리입니다." });
  }

  try {
    const sql = `
      SELECT p.id, p.title, p.content, p.views, p.likes, p.created_at, u.nickname AS author
      FROM ${tableName} p
      JOIN users u ON p.author_id = u.id
      WHERE p.id = ?
    `;
    const [rows] = await db.execute(sql, [postId]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "게시글을 찾을 수 없습니다." });
    }

    return res.status(200).json(rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "게시글 조회 실패" });
  }
};
export async function getPopularPosts(req, res) {
  try {
    const sql = `
      SELECT id, title, views, author_id, created_at, 'notice' AS category FROM notice_posts
      UNION ALL
      SELECT id, title, views, author_id, created_at, 'freetalk' AS category FROM free_posts
      UNION ALL
      SELECT id, title, views, author_id, created_at, 'qna' AS category FROM qna_posts
      ORDER BY views DESC
      LIMIT 20;
    `;
    const posts = await query(sql);
    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '서버 에러 발생' });
  }
};
export const deletePost = async (req, res) => {
  const { category, postId } = req.params;

  let tableName;
  switch (category) {
    case 'notice':
      tableName = 'notice_posts';
      break;
    case 'freetalk':
      tableName = 'free_posts';
      break;
    case 'qna':
      tableName = 'qna_posts';
      break;
    default:
      return res.status(400).json({ error: '잘못된 카테고리입니다.' });
  }
  try {
    const [result] = await db.query(
      `DELETE FROM ${tableName} WHERE id = ?`,
      [postId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: '삭제할 게시글을 찾을 수 없습니다.' });
    }

    res.json({ message: '게시글 삭제 완료' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '게시글 삭제 실패' });
  }
};


