import cookieParser from "cookie-parser";
import express, { Application, Request, Response } from "express";
import cors from "cors"
import config from "./config";
import { prisma } from "./lib/prisma";
import  httpStatus  from "http-status";
import bcrypt from "bcryptjs";

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


app.post("/api/users/register", async (req: Request, res: Response) => {
    const {name, email, password, profilePhoto} = req.body;
    console.log(name, email, password, profilePhoto);

    const isUserExist = await prisma.user.findUnique({
        where : {email}
    })

    if (isUserExist) {
        throw new Error("User wiht this email already exist");
    }

    const hashedPassword = await bcrypt.hash(password, Number(config.bcrypt_salt_rounds))
    
    const createdUser = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
        }
    });

    await prisma.profile.create({
        data: {
            userId: createdUser.id,
            profilePhoto
        }
    });


    const user = await prisma.user.findUnique({
        where: {
            id: createdUser.id,
            email: createdUser.email || email 
        },
        omit: {
            password: true
        },
        include: {
            profile: true
        }
    })


    res.status(httpStatus.CREATED).json({
        success: true,
        statusCode: httpStatus.CREATED,
        message: "User registerd Successfully",
        data: {
            user
        }
    })
    
})


app.get("/", async (req: Request, res: Response) => {    
    res.send("Hellow, workd")
});


export default app;