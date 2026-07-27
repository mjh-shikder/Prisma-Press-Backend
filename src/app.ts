import cookieParser from "cookie-parser";
import express, { Application, Request, Response } from "express";
import cors from "cors"
import config from "./config";
import { prisma } from "./lib/prisma";
import { log } from "console";

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

app.get("/", async (req: Request, res: Response) => {    
    res.send("Hellow, workd")
});


export default app;