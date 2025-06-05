// controllers/authController.js
import db from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "studyhub";


export const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "모든 필드를 입력하세요." });
  }

  const [existingUsers] = await db.query("SELECT id FROM users WHERE email = ?", [email]);
  if (existingUsers.length > 0) {
    return res.status(400).json({ message: "이미 등록된 이메일입니다." });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const [result] = await db.query(
    "INSERT INTO users (nickname, email, password) VALUES (?, ?, ?)",
    [name, email, hashedPassword]
  );

  // JWT 토큰 생성
  const token = jwt.sign(
    {
      id: result.insertId,
      email,
      nickname: name,
      isAdmin: false, // 기본값, 관리자는 별도 설정 필요
    },
    JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.status(201).json({
    token,
    id: result.insertId,
    email,
    nickname: name,
    isAdmin: false,
  });
};


export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "모든 필드를 입력하세요." });
  }

  try {
    const [users] = await db.query(
      "SELECT id, email, password, nickname, is_admin FROM users WHERE email = ?",
      [email]
    );

    if (users.length === 0) {
      return res.status(400).json({ message: "등록되지 않은 이메일입니다." });
    }

    const user = users[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "비밀번호가 틀렸습니다." });
    }

    // 로그인 성공 후 토큰 발급
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        nickname: user.nickname,
        isAdmin: user.is_admin === 1,
      },
      JWT_SECRET,
      { expiresIn: "1d" } // 토큰 유효기간 1일
    );

    res.json({
      token,
      id: user.id,
      email: user.email,
      nickname: user.nickname,
      isAdmin: user.is_admin === 1,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
};
export const changePassword = async (req, res) => {
  const userId = req.user.id; // authMiddleware에서 넣어준 사용자 정보
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: "현재 비밀번호와 새 비밀번호를 모두 입력하세요." });
  }

  try {
    // 1) DB에서 사용자 비밀번호 조회
    const [users] = await db.query("SELECT password FROM users WHERE id = ?", [userId]);
    if (users.length === 0) {
      return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
    }

    const user = users[0];

    // 2) 현재 비밀번호 검증
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "현재 비밀번호가 틀렸습니다." });
    }

    // 3) 새 비밀번호 해시화
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 4) 비밀번호 변경
    await db.query("UPDATE users SET password = ? WHERE id = ?", [hashedPassword, userId]);

    res.json({ message: "비밀번호가 성공적으로 변경되었습니다." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
};
export const deleteAccount = async (req, res) => {
  const userId = req.user.id; // 로그인된 사용자 ID (authMiddleware에서 세팅됨)

  try {
    // 회원 삭제
    await db.query("DELETE FROM users WHERE id = ?", [userId]);
    res.json({ message: "계정이 성공적으로 삭제되었습니다." });
  } catch (error) {
    console.error("계정 삭제 중 오류:", error);
    res.status(500).json({ message: "계정 삭제에 실패했습니다." });
  }
};
export const getProfile = async (req, res) => {
  const userId = req.user.id;

  try {
    const [rows] = await db.query(
  "SELECT id, nickname AS name, region, certificate, university, age, phone, gender, is_admin FROM users WHERE id = ?",
  [userId]
);


    if (rows.length === 0) {
      return res.status(404).json({ message: "사용자 정보를 찾을 수 없습니다." });
    }

    const user = rows[0];

    res.status(200).json(user);
  } catch (err) {
    console.error("프로필 조회 오류:", err);
    res.status(500).json({ message: "서버 오류로 프로필을 가져오지 못했습니다." });
  }
};

export const updateProfile = async (req, res) => {
  const userId = req.user.id;
  console.log("받은 req.body:", req.body);
  const { nickname, university, certificate, region, phone, age, gender } = req.body;

  try {


    const [result] = await db.query(
      `UPDATE users 
   SET nickname = ?, university = ?, certificate = ?, region = ?, phone = ?, age = ?, gender = ?
   WHERE id = ?`,
      [nickname, university, certificate, region, phone, age, gender, userId]
    );


    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
    }

    res.json({ message: "프로필이 성공적으로 업데이트되었습니다." });
  } catch (error) {
    console.error("프로필 업데이트 오류:", error);
    res.status(500).json({ message: "서버 오류로 프로필을 수정하지 못했습니다." });
  }
};
