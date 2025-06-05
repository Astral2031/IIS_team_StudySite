import db from "../config/db.js";

export const search = async (req, res) => {
  const query = req.query.q;

  if (!query) {
    return res.status(400).json({ error: "검색어가 없습니다." });
  }

    try {
        const [posts] = await db.query(
            `SELECT id, title, content, author_id, created_at, 'free' as post_type FROM free_posts WHERE title LIKE ? OR content LIKE ?
             UNION
             SELECT id, title, content, author_id, created_at, 'qna' as post_type FROM qna_posts WHERE title LIKE ? OR content LIKE ?
             UNION
             SELECT id, title, content, author_id, created_at, 'notice' as post_type FROM notice_posts WHERE title LIKE ? OR content LIKE ?`,
             [`%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`]
        );


    const [studies] = await db.query(
      `SELECT id, title, description FROM studies WHERE title LIKE ? OR description LIKE ?`,
      [`%${query}%`, `%${query}%`]
    );

    res.json({ posts, studies });
  } catch (err) {
    console.error("검색 오류:", err);
    res.status(500).json({ error: "서버 오류" });
  }
};
