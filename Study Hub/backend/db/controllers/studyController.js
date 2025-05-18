// controllers/studyController.js
import db from "../config/db.js";

export const createStudy = async (req, res) => {
    try {
        const {
            title,
            subject,
            description,
            participants,
            maxParticipants,
            host_id,
        } = req.body;

        if (!title || !description || !maxParticipants || !host_id) {
            return res.status(400).json({ message: "필수 입력값이 없습니다." });
        }

        const currentParticipants = participants || 1;

        const query = `
      INSERT INTO studies 
      (title, subject, description, participants, maxParticipants, host_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

        const values = [
            title,
            subject || null,
            description,
            currentParticipants,
            maxParticipants,
            host_id,
        ];

        const [result] = await db.query(query, values);

        res.status(201).json({ message: "스터디 생성 완료", studyId: result.insertId });
    } catch (error) {
        console.error("스터디 생성 오류:", error);
        res.status(500).json({ message: "서버 오류 발생" });
    }
};

