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
          p.id, p.title, p.views, p.author_id, u.nickname AS author, p.created_at, 'notice' AS category
        FROM notice_posts p
        JOIN users u ON p.author_id = u.id

        UNION ALL

        SELECT 
          p.id, p.title, p.views, p.author_id, u.nickname AS author, p.created_at, 'freetalk' AS category
        FROM free_posts p
        JOIN users u ON p.author_id = u.id

        UNION ALL

        SELECT 
          p.id, p.title, p.views, p.author_id, u.nickname AS author, p.created_at, 'qna' AS category
        FROM qna_posts p
        JOIN users u ON p.author_id = u.id
      ) AS combined_posts
      ORDER BY views DESC
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
  const connection = await db.getConnection();
  console.log("req.user:", req.user); // 여기에 유저 정보가 제대로 찍히는지 확인
  try {
    const { category, postId } = req.params;
    const userId = req.user.id;

    if (!userId) {
      return res.status(403).json({ message: "인증된 사용자만 좋아요를 누를 수 있습니다." });
    }

    const validCategories = ['notice', 'freetalk', 'qna'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({ message: "잘못된 카테고리입니다." });
    }

    const postIdNum = Number(postId);
    if (isNaN(postIdNum)) {
      return res.status(400).json({ message: "잘못된 게시글 ID입니다." });
    }

    const tableName = category === 'freetalk' ? 'free_posts' : `${category}_posts`;

    await connection.beginTransaction();
    


    // 기존 좋아요 여부 확인
    // 쿼리 결과를 배열 구조분해로 받기
const [existing] = await connection.query(
  "SELECT * FROM post_likes WHERE post_type = ? AND post_id = ? AND user_id = ?",
  [category, postIdNum, userId]
);

console.log("existing 좋아요 데이터:", existing);

if (existing.length > 0) {
  // 좋아요 취소
  await connection.query(
    "DELETE FROM post_likes WHERE post_type = ? AND post_id = ? AND user_id = ?",
    [category, postIdNum, userId]
  );
  await connection.query(
    `UPDATE ${tableName} SET likes = GREATEST(likes - 1, 0) WHERE id = ?`,
    [postIdNum]
  );
} else {
  // 좋아요 추가
  try {
    await connection.query(
      "INSERT INTO post_likes (post_type, post_id, user_id) VALUES (?, ?, ?)",
      [category, postIdNum, userId]
    );
    await connection.query(
      `UPDATE ${tableName} SET likes = likes + 1 WHERE id = ?`,
      [postIdNum]
    );
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      console.log("중복 추천 시도 감지, 무시");
    } else {
      throw error;
    }
  }
}


    // 최신 게시글 정보 조회
    const [postRows] = await connection.query(
      `
      SELECT p.id, p.title, p.content, p.views, p.likes, p.created_at, u.nickname AS author
      FROM ${tableName} p
      JOIN users u ON p.author_id = u.id
      WHERE p.id = ?
      `,
      [postIdNum]
    );

    if (postRows.length === 0) {
      await connection.rollback();
      return res.status(404).json({ message: "게시글을 찾을 수 없습니다." });
    }

    const updatedPost = postRows[0];

    // 좋아요한 유저 목록
    const [likedUsers] = await connection.query(
      "SELECT user_id FROM post_likes WHERE post_type = ? AND post_id = ?",
      [category, postIdNum]
    );

    updatedPost.likedBy = likedUsers.map(row => row.user_id);

    await connection.commit();

    res.status(200).json(updatedPost);
  } catch (err) {
    await connection.rollback();
    console.error("좋아요 처리 중 오류:", err);
    res.status(500).json({ message: "좋아요 처리 중 오류" });
  } finally {
    connection.release();
  }
};








