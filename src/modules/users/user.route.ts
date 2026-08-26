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
import { auth } from "../../middlewares/auth";

const router = Router();



router.post("/register", userController.registerUser);


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


router.put("/my-profile", auth(Role.ADMIN, Role.USER, Role.AUTHOR), userController.updateMyProfile);

export const userRouter = router;
