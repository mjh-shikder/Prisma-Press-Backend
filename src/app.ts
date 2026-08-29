import cookieParser from "cookie-parser";
import express, { Application, Request, Response } from "express";
import cors from "cors"
import config from "./config";
import { prisma } from "./lib/prisma";
import  httpStatus  from "http-status";
import bcrypt from "bcryptjs";
import { userRouter } from "./modules/users/user.route";
import { authRoutes } from "./modules/auth/auth.routes";
import { postRoutes } from "./modules/post/post.route";
import { commentRoutes } from "./modules/comment/comment.route";

const app: Application = express();

// ? Middleware
app.use(cors({
    origin: config.app_url,
    credentials: true,
}))
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())


//?


app.use("/api/user", userRouter)
app.use("/api/auth", authRoutes)
app.use("api/posts", postRoutes)
app.use("/api/comments", commentRoutes)

app.get("/", async (req: Request, res: Response) => {    
    res.send("Hellow, workd")
});


export default app;