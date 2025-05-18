import db from "../config/db.js";

// 댓글 작성
export const createComment = async (req, res) => {
  const { category, postId } = req.params;
  const { content } = req.body;
  const author_id = req.user.id;


  if (!author_id) return res.status(401).json({ message: "로그인이 필요합니다." });
  if (!content) return res.status(400).json({ message: "댓글 내용을 입력하세요." });

  // post_type 매핑
  let post_type;
  switch (category) {
    case "notice":
      post_type = "notice";
      break;
    case "freetalk":
      post_type = "free";  // 주의: comments 테이블은 'free'
      break;
    case "qna":
      post_type = "qna";
      break;
    default:
      return res.status(400).json({ message: "잘못된 카테고리입니다." });
  }

  try {
    const sql = `
      INSERT INTO comments (post_type, post_id, author_id, content)
      VALUES (?, ?, ?, ?)
    `;
    const [result] = await db.execute(sql, [post_type, postId, author_id, content]);
    res.status(201).json({ message: "댓글 작성 완료", commentId: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "댓글 작성 실패" });
  }
};

// 특정 게시글 댓글 조회
export const getCommentsByPost = async (req, res) => {
  const { category, postId } = req.params;

  let post_type;
  switch (category) {
    case "notice":
      post_type = "notice";
      break;
    case "freetalk":
      post_type = "free";
      break;
    case "qna":
      post_type = "qna";
      break;
    default:
      return res.status(400).json({ message: "잘못된 카테고리입니다." });
  }

  try {
    const sql = `
      SELECT c.id, c.content, c.created_at, c.updated_at, u.nickname AS author
      FROM comments c
      JOIN users u ON c.author_id = u.id
      WHERE c.post_type = ? AND c.post_id = ?
      ORDER BY c.created_at ASC
    `;
    const [rows] = await db.execute(sql, [post_type, postId]);
    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "댓글 조회 실패" });
  }
};

// 댓글 수정
export const updateComment = async (req, res) => {
  const { category, postId, commentId } = req.params;
  const { content } = req.body;
  const userId = req.user?.id;

  if (!userId) return res.status(401).json({ message: "로그인이 필요합니다." });
  if (!content) return res.status(400).json({ message: "댓글 내용을 입력하세요." });

  let post_type;
  switch (category) {
    case "notice":
      post_type = "notice";
      break;
    case "freetalk":
      post_type = "free";
      break;
    case "qna":
      post_type = "qna";
      break;
    default:
      return res.status(400).json({ message: "잘못된 카테고리입니다." });
  }

  try {
    // 본인 댓글인지 확인
    const [commentRows] = await db.execute(
      `SELECT * FROM comments WHERE id = ? AND post_type = ? AND post_id = ?`,
      [commentId, post_type, postId]
    );
    if (commentRows.length === 0) return res.status(404).json({ message: "댓글을 찾을 수 없습니다." });
    if (commentRows[0].author_id !== userId) return res.status(403).json({ message: "본인 댓글만 수정할 수 있습니다." });

    // 수정 처리
    await db.execute(
      `UPDATE comments SET content = ? WHERE id = ?`,
      [content, commentId]
    );

    // 수정 후 최신 댓글 반환
    const [updatedRows] = await db.execute(`SELECT * FROM comments WHERE id = ?`, [commentId]);
    res.status(200).json(updatedRows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "댓글 수정 실패" });
  }
};

// 댓글 삭제
export const deleteComment = async (req, res) => {
  const { category, postId, commentId } = req.params;
  const userId = req.user?.id;

  if (!userId) return res.status(401).json({ message: "로그인이 필요합니다." });

  let post_type;
  switch (category) {
    case "notice":
      post_type = "notice";
      break;
    case "freetalk":
      post_type = "free";
      break;
    case "qna":
      post_type = "qna";
      break;
    default:
      return res.status(400).json({ message: "잘못된 카테고리입니다." });
  }

  try {
    // 본인 댓글인지 확인
    const [commentRows] = await db.execute(
      `SELECT * FROM comments WHERE id = ? AND post_type = ? AND post_id = ?`,
      [commentId, post_type, postId]
    );
    if (commentRows.length === 0) return res.status(404).json({ message: "댓글을 찾을 수 없습니다." });
    if (commentRows[0].author_id !== userId) return res.status(403).json({ message: "본인 댓글만 삭제할 수 있습니다." });

    // 삭제 처리
    await db.execute(`DELETE FROM comments WHERE id = ?`, [commentId]);
    res.status(200).json({ message: "댓글 삭제 완료" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "댓글 삭제 실패" });
  }
};
