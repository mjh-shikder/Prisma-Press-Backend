import { NextFunction, Request, Response, Router } from "express";
import { prisma } from "../../lib/prisma";
import bcrypt from "bcryptjs";
import config from "../../config";
import httpStatus from "http-status";
import { userController } from "./user.controller";
import { jwtUtils } from "../../utils/jwt";
import { Role } from "../../../generated/prisma/enums";
import { catchAsync } from "../../utils/catchAsync";
import { JwtPayload } from "jsonwebtoken";

const router = Router();

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
// auth(Role.ADMIN, Role.USER, Role.AUTHOR)
// auth()=> ...requiredRoles => [Role.ADMIN, Role.USER, Role.AUTHOR]
const auth = (...requiredRoles: Role[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token =
        req.cookies.accessToken
    //         ||
    //   req.headers.authorization?.startsWith("Bearer ")
    //     ? req.headers.authorization?.split(" ")[1]
    //     : req.headers.authorization;

    if (!token) {
      throw new Error("Youre not logged in! Please log in to get access.");
    }

    const verifiedToken = jwtUtils.verifiyToken(
      token,
      config.jwt_access_secret,
    );

    if (!verifiedToken.success) {
      throw new Error(verifiedToken.error);
    }

    if (!verifiedToken.success) {
      throw new Error(verifiedToken.error);
    }

    const { email, name, id, role } = verifiedToken.data as JwtPayload;

    if (requiredRoles.length && !requiredRoles.includes(role)) {
      throw new Error(
        "Forbidden. You do not have permission to access this resource.",
      );
    }

    // Now check if the user exists in the database
    const user = await prisma.user.findUnique({
      where: { id, email, name, role },
    });

    if (!user) {
      throw new Error("User not Found! Please log in again.");
    }

    if (user.activeStatus === "BLOCKED") {
      throw new Error("Your account is blocked. Please contact support.");
    }

    req.user = { email, name, id, role };

    next();
  });
};

router.get(
  "/me",
  //   (req: Request, res: Response, next: NextFunction) => {
  //     console.log(req.cookies);

  //     const { accessToken } = req.cookies;

  //     const verifiedToken = jwtUtils.verifiyToken(
  //       accessToken,
  //       config.jwt_access_secret,
  //       );

  //       if (!verifiedToken.success) {
  //           throw new Error(verifiedToken.error);
  //       }

  //     if (typeof verifiedToken === "string") {
  //       throw new Error(verifiedToken);
  //     }

  //     const requiredRoles = [Role.ADMIN, Role.USER, Role.AUTHOR];

  //     const { email, name, id, role } = verifiedToken.data as JwtPayload;

  //     if (!requiredRoles.includes(role)) {
  //       return res.status(httpStatus.FORBIDDEN).json({
  //         success: false,
  //         statusCode: httpStatus.FORBIDDEN,
  //         message: "You do not have permission to access this resource",
  //       });
  //     }

  //     req.user = { email, name, id, role };

  //     next();
  //   },

  auth(Role.ADMIN, Role.USER, Role.AUTHOR),
  userController.getMyProfile,
);

export const userRouter = router;
