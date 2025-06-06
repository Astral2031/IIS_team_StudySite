import db, { query } from "../config/db.js";

export const createPost = async (req, res) => {
  let { category } = req.params;  // let으로 바꿔야 아래에서 수정 가능
  const { title, content, author_id } = req.body;

  if (!title || !content || !author_id) {
    return res.status(400).json({ error: "필수 데이터가 누락되었습니다." });
  }

  // popular은 freetalk 게시판에 저장
  if (category === "popular") {
    category = "freetalk";
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

  let tableName, post_type;
  switch (category) {
    case "notice":
      tableName = "notice_posts";
      post_type = "notice";
      break;
    case "freetalk":
      tableName = "free_posts";
      post_type = "free";
      break;
    case "qna":
      tableName = "qna_posts";
      post_type = "qna";
      break;
    default:
      return res.status(400).json({ error: "올바르지 않은 카테고리입니다." });
  }

  try {
    // 게시글 조회
    const sqlPost = `
      SELECT p.id, p.title, p.content, p.views, p.likes, p.created_at, u.nickname AS author
      FROM ${tableName} p
      JOIN users u ON p.author_id = u.id
      WHERE p.id = ?
    `;
    const [posts] = await db.execute(sqlPost, [postId]);

    if (posts.length === 0) {
      return res.status(404).json({ error: "게시글을 찾을 수 없습니다." });
    }

    // 댓글 조회
    const sqlComments = `
      SELECT c.id, c.content, c.created_at, c.updated_at, u.nickname AS author
      FROM comments c
      JOIN users u ON c.author_id = u.id
      WHERE c.post_type = ? AND c.post_id = ?
      ORDER BY c.created_at ASC
    `;
    const [comments] = await db.execute(sqlComments, [post_type, postId]);

    // 게시글 + 댓글 같이 보내기
    return res.status(200).json({ ...posts[0], comments });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "게시글 조회 실패" });
  }
};

export const getPopularPosts = async (req, res) => {
  try {
    const sql = `
      SELECT * FROM (
        SELECT 
          p.id, p.title, p.views, p.likes, p.author_id, u.nickname AS author, p.created_at, 'notice' AS category
        FROM notice_posts p
        JOIN users u ON p.author_id = u.id

        UNION ALL

        SELECT 
          p.id, p.title, p.views, p.likes, p.author_id, u.nickname AS author, p.created_at, 'freetalk' AS category
        FROM free_posts p
        JOIN users u ON p.author_id = u.id

        UNION ALL

        SELECT 
          p.id, p.title, p.views, p.likes, p.author_id, u.nickname AS author, p.created_at, 'qna' AS category
        FROM qna_posts p
        JOIN users u ON p.author_id = u.id
      ) AS combined_posts
      ORDER BY likes DESC
      LIMIT 20;
    `;

    const [posts] = await db.query(sql);
    res.json(posts);
  } catch (error) {
    console.error("인기글 조회 중 오류:", error.sqlMessage || error.message);
    res.status(500).json({ message: "서버 에러 발생" });
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
export const updatePost = async (req, res) => {
  const { category, postId } = req.params;
  const { title, content } = req.body;

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
      `UPDATE ${tableName} SET title = ?, content = ? WHERE id = ?`,
      [title, content, postId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: '수정할 게시글을 찾을 수 없습니다.' });
    }

    const [rows] = await db.query(`SELECT * FROM ${tableName} WHERE id = ?`, [postId]);

    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '게시글 수정 실패' });
  }
};

export const toggleLike = async (req, res) => {
  const { category, postId } = req.params;
  const userId = req.user.id;

  // ✅ 카테고리별 실제 테이블 이름 매핑
  const tableMap = {
    study: "studies",
    notice: "notice_posts",
    freetalk: "free_posts",
    qna: "qna_posts",
  };

  const tableName = tableMap[category];
  if (!tableName) {
    return res.status(400).json({ message: "잘못된 카테고리입니다." });
  }

  try {
    const [rows] = await db.execute(
      `SELECT * FROM post_likes WHERE post_type = ? AND post_id = ? AND user_id = ?`,
      [category, postId, userId]
    );

    if (rows.length > 0) {
      // 좋아요 취소
      await db.execute(
        `DELETE FROM post_likes WHERE post_type = ? AND post_id = ? AND user_id = ?`,
        [category, postId, userId]
      );
      await db.execute(
        `UPDATE ${tableName} SET likes = likes - 1 WHERE id = ?`,
        [postId]
      );
    } else {
      // 좋아요 추가
      await db.execute(
        `INSERT INTO post_likes (post_type, post_id, user_id, liked_at) VALUES (?, ?, ?, NOW())`,
        [category, postId, userId]
      );
      await db.execute(
        `UPDATE ${tableName} SET likes = likes + 1 WHERE id = ?`,
        [postId]
      );
    }

    const [[updated]] = await db.execute(
      `SELECT likes FROM ${tableName} WHERE id = ?`,
      [postId]
    );

    const [[likeRow]] = await db.execute(
      `SELECT * FROM post_likes WHERE post_type = ? AND post_id = ? AND user_id = ?`,
      [category, postId, userId]
    );

    res.status(200).json({
      likes: updated.likes,
      likedBy: likeRow ? [userId] : [],
    });
  } catch (err) {
    console.error("좋아요 처리 중 오류:", err);
    res.status(500).json({ message: "서버 오류 발생" });
  }
};
export const getMyAllPosts = async (req, res) => {
  const { userId } = req.params;

  try {
    const sql = `
      SELECT p.id, p.title, p.content, p.views, p.likes, p.created_at, 'notice' AS category
      FROM notice_posts p
      WHERE p.author_id = ?
      UNION ALL
      SELECT p.id, p.title, p.content, p.views, p.likes, p.created_at, 'freetalk' AS category
      FROM free_posts p
      WHERE p.author_id = ?
      UNION ALL
      SELECT p.id, p.title, p.content, p.views, p.likes, p.created_at, 'qna' AS category
      FROM qna_posts p
      WHERE p.author_id = ?
      ORDER BY created_at DESC
    `;

    // userId 3번 넣어줘야 하므로 배열로 전달
    const [rows] = await db.execute(sql, [userId, userId, userId]);

    return res.status(200).json({ posts: rows });
  } catch (error) {
    console.error("내가 쓴 모든 글 조회 실패:", error);
    return res.status(500).json({ error: "내가 쓴 모든 글 조회 실패" });
  }
};
export const getMyAllComments = async (req, res) => {
  const { userId } = req.params;

  try {
    const sql = `
      SELECT c.id, c.content, c.created_at, c.updated_at, c.post_type, c.post_id,
             p.title AS post_title
      FROM comments c
      LEFT JOIN (
        SELECT id, title, 'notice' AS post_type FROM notice_posts
        UNION ALL
        SELECT id, title, 'freetalk' AS post_type FROM free_posts
        UNION ALL
        SELECT id, title, 'qna' AS post_type FROM qna_posts
      ) p ON c.post_id = p.id AND c.post_type = p.post_type
      WHERE c.author_id = ?
      ORDER BY c.created_at DESC
    `;

    const [comments] = await db.execute(sql, [userId]);

    return res.status(200).json({ comments });
  } catch (error) {
    console.error("내가 쓴 댓글 조회 실패:", error);
    return res.status(500).json({ error: "내가 쓴 댓글 조회 실패" });
  }
};

