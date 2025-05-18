// controllers/authController.js
import db from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "studyhub";


export const register = async (req, res) => {
  const { name, email, password } = req.body;

  // 필수값 체크
  if (!name || !email || !password) {
    return res.status(400).json({ message: "모든 필드를 입력하세요." });
  } 

  // 이미 이메일이 존재하는지 확인
  const [existingUsers] = await db.query("SELECT id FROM users WHERE email = ?", [email]);
  if (existingUsers.length > 0) {
    return res.status(400).json({ message: "이미 등록된 이메일입니다." });
  }

  // 비밀번호 해시화
  const hashedPassword = await bcrypt.hash(password, 10);

  // DB에 사용자 생성
  const [result] = await db.query(
    "INSERT INTO users (nickname, email, password) VALUES (?, ?, ?)",
    [name, email, hashedPassword]
  );

  // 생성된 사용자 정보 (id, email, nickname) 리턴 (비밀번호 제외)
  res.status(201).json({
    id: result.insertId,
    email,
    nickname: name,
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
console.log(token);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
};

