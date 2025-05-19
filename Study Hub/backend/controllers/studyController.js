import db from "../config/db.js";

export const createStudy = async (req, res) => {
    try {
        const {
            title,
            subject,
            description,
            current_members, // 기존 participants 대신 current_members
            max_members,     // 기존 maxParticipants 대신 max_members
            category,
            host_id,
        } = req.body;

        if (!title || !description || !max_members || !host_id || !category) {
            return res.status(400).json({ message: "필수 입력값이 없습니다." });
        }

        const currentParticipants = current_members || 1;

        const query = `
  INSERT INTO studies 
  (title, subject, description, current_members, max_members, category, host_id)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`;

        const values = [
            title,
            subject || null,
            description,
            currentParticipants,
            max_members,
            category,
            host_id,
        ];

        const [result] = await db.query(query, values);


        res.status(201).json({ message: "스터디 생성 완료", studyId: result.insertId });
    } catch (error) {
        console.error("스터디 생성 오류:", error);
        res.status(500).json({ message: "서버 오류 발생" });
    }
};
export const getStudies = async (req, res) => {
  try {
    const { category } = req.query;

    let query = "SELECT * FROM studies";
    let values = [];

    if (category && category !== "전체") {
      query += " WHERE category = ?";
      values.push(category);
    }

    const [studies] = await db.query(query, values);

    res.json(studies);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "서버 오류 발생" });
  }
};
export const deleteStudy = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query("DELETE FROM studies WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "해당 스터디가 존재하지 않습니다." });
    }

    res.status(200).json({ message: "스터디가 삭제되었습니다." });
  } catch (error) {
    console.error("스터디 삭제 오류:", error);
    res.status(500).json({ message: "서버 오류 발생" });
  }
};
