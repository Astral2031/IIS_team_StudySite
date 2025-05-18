import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import studyRoutes from "./routes/studyRoutes.js";
import postsRoutes from "./routes/postsRoutes.js";
import commentRouter from "./routes/commentsRoutes.js";

const app = express();
const PORT = 5000;

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));

app.use(express.json());

// 라우트
app.use("/api/auth", authRoutes);
app.use("/api/studies", studyRoutes);
app.use("/api/posts", postsRoutes);
app.use("/api/posts", commentRouter); 



// 서버 시작
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
