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
export const applyToStudy = async (req, res) => {
  try {
    const { id } = req.params; // study_id
    const { userId, name, available_time, reason } = req.body;

    if (!userId || !name || !available_time || !reason) {
      return res.status(400).json({ message: "필수 항목 누락" });
    }

    const query = `
      INSERT INTO study_applications (study_id, user_id, name, available_time, message, status, applied_at)
      VALUES (?, ?, ?, ?, ?, 'pending', NOW())
    `;
    const values = [id, userId, name, available_time, reason];

    await db.query(query, values);

    res.status(201).json({ message: "스터디 신청 완료" });
  } catch (error) {
    console.error("스터디 신청 오류:", error);
    res.status(500).json({ message: "서버 오류 발생" });
  }
};
export const getStudyById = async (req, res) => {
  try {
    const { id } = req.params;
    const [studies] = await db.query("SELECT * FROM studies WHERE id = ?", [id]);

    if (studies.length === 0) {
      return res.status(404).json({ message: "해당 스터디를 찾을 수 없습니다." });
    }

    res.json(studies[0]);
  } catch (error) {
    console.error("스터디 상세 조회 오류:", error);
    res.status(500).json({ message: "서버 오류 발생" });
  }
};
export const getMyHostedStudyApplicants = async (req, res) => {
  try {
    const currentUserId = req.user.id; // 토큰에서 받은 로그인 유저 ID
    const studyId = req.params.id; // URL 파라미터에서 스터디 ID

    // 1) 현재 유저가 호스트인지 확인 (host_id와 currentUserId 비교)
    const [studies] = await db.query(
      `SELECT id FROM studies WHERE id = ? AND host_id = ?`,
      [studyId, currentUserId]
    );

    if (studies.length === 0) {
      return res.status(403).json({ message: "접근 권한이 없습니다. 호스트가 아닙니다." });
    }

    // 2) 신청자 조회
    const [applicants] = await db.query(
      `
      SELECT sa.*, u.nickname, u.email
      FROM study_applications sa
      JOIN users u ON sa.user_id = u.id
      WHERE sa.study_id = ?
      `,
      [studyId]
    );

    if (applicants.length === 0) {
      return res.status(404).json({ message: "신청자가 없습니다." });
    }

    res.json(applicants);
  } catch (error) {
    console.error("신청자 조회 오류:", error);
    res.status(500).json({ message: "서버 오류 발생" });
  }
};
export const getHostedStudies = async (req, res) => {
  try {
    const userId = req.user.id;

    const [rows] = await db.query(
      `SELECT id FROM studies WHERE host_id = ?`,
      [userId]
    );

    res.json(rows);
  } catch (err) {
    console.error("호스팅한 스터디 조회 오류:", err);
    res.status(500).json({ message: "서버 오류 발생" });
  }
};





