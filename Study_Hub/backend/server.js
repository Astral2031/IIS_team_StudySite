import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import studyRoutes from "./routes/studyRoutes.js";
import postsRoutes from "./routes/postsRoutes.js";
import searchRoutes from "./routes/searchRoutes.js";
import commetRoutes from "./routes/commentsRoutes.js";
import 'dotenv/config';


const app = express();
const PORT = process.env.PORT || 3001;


app.use(cors({
  origin : process.env.CLIENT_ORIGIN,
  credentials: true,
}));

app.use(express.json());

// 라우트
app.use("/api/auth", authRoutes);
app.use("/api/studies", studyRoutes);
app.use("/api/posts", postsRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/comments", commetRoutes);



// 서버 시작
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
