import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import studyRoutes from "./routes/studyRoutes.js";
import postsRoutes from "./routes/postsRoutes.js";
import commentRouter from "./routes/commentsRoutes.js";

//const express = require('express');
//const cors = require('cors');
//const dotenv = require('dotenv');
//const { OpenAI } = require('openai');

//dotenv.config();

const app = express();
const PORT = 5003;


app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));

app.use(express.json());

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY
// });

// // 아이디 추천
// app.get('/api/suggest-username', async (req, res) => {
//   const { base } = req.query;

//   if (!base) {
//     return res.status(400).json({ error: '기본 이름이 필요합니다.' });
//   }

//   try {
//     const response = await openai.chat.completions.create({
//       model: "gpt-4", // 또는 "gpt-3.5-turbo"
//       messages: [
//         {
//           role: "user",
//           content: `기본 이름 "${base}"를 참고해서 재미있고 유니크한 사용자 아이디 5개 추천해줘. 영어 소문자와 숫자 조합만 써줘.`
//         }
//       ],
//       temperature: 0.8,
//       max_tokens: 100
//     });

//     const suggestions = response.choices[0].message.content.trim().split('\n').map(line => line.replace(/^\d+[\).\s]+/, ''));

//     res.json({ suggestions });
//   } catch (error) {
//     console.error('OpenAI 에러:', error.message);
//     res.status(500).json({ error: '아이디 추천 중 에러 발생' });
//   }
// });

// // 비밀번호 추천
// app.get('/api/suggest-password', async (req, res) => {
//   try {
//     const response = await openai.chat.completions.create({
//       model: "gpt-4", // 또는 "gpt-3.5-turbo"
//       messages: [
//         {
//           role: "user",
//           content: "안전하고 기억하기 쉬운 비밀번호 3개 추천해줘. 대소문자, 숫자, 특수문자 포함하고, 10~14자로 구성해줘."
//         }
//       ],
//       temperature: 0.7,
//       max_tokens: 100
//     });

//     const suggestions = response.choices[0].message.content.trim().split('\n').map(line => line.replace(/^\d+[\).\s]+/, ''));

//     res.json({ suggestions });
//   } catch (error) {
//     console.error('OpenAI 에러:', error.message);
//     res.status(500).json({ error: '비밀번호 추천 중 에러 발생' });
//   }
// });

// 라우트
app.use("/api/auth", authRoutes);
app.use("/api/studies", studyRoutes);
app.use("/api/posts", postsRoutes);
app.use("/api/posts", commentRouter); 



// 서버 시작
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
