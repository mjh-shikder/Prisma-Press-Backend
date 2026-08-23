import { NextFunction, Request, Response, Router } from "express";
import { prisma } from "../../lib/prisma";
import bcrypt from "bcryptjs";
import config from "../../config";
import httpStatus from "http-status";
import { userController } from "./user.controller";
import { jwtUtils } from "../../utils/jwt";
import { Role } from "../../../generated/prisma/enums";


const router = Router()


declare global {
    namespace Express {
        interface Request {
            user?: {
                email: string;
                name: string;
                id: string;
                role: Role;
            };
        }
    }
}

router.post("/register", userController.registerUser);

router.get("/me", (req: Request, res: Response, next: NextFunction) => {
   console.log(req.cookies);
    
    const { accessToken } = req.cookies
    
    const verifiedToken = jwtUtils.verifiyToken(accessToken, config.jwt_access_secret)


    if (typeof verifiedToken === "string") {
        throw new Error(verifiedToken);
    }


     const requiredRoles = [Role.ADMIN, Role.USER, Role.AUTHOR];

    const { email, name, id, role } = verifiedToken;
    
    if (!requiredRoles.includes(role)) {
        return res.status(httpStatus.FORBIDDEN).json({
            success: false,
            statusCode: httpStatus.FORBIDDEN,
            message: "You do not have permission to access this resource",
        });
    }

    req.user = { email, name, id, role };


    next()
    
}, userController.getMyProfile);

export const userRouter = router;