import { NextFunction, Request, RequestHandler, Response } from "express";
import httpStatus from "http-status";
import { userServcie } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import jwt from "jsonwebtoken";
import config from "../../config";
import { jwtUtils } from "../../utils/jwt";



// const registerUser = async (req: Request, res: Response) => {
// try {
//       const payload = req.body;

//       const user = await userServcie.registerUserIntoDB(payload);

//       res.status(httpStatus.CREATED).json({
//         success: true,
//         statusCode: httpStatus.CREATED,
//         message: "User registerd Successfully",
//         data: {
//           user,
//         },
//       });
// } catch (error) {
//     console.log(error);
//     res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
//         success: false,
//         statusCode: httpStatus.INTERNAL_SERVER_ERROR,
//         message: "Failed to Register User",
//         error: (error as Error).message
//     })
// }
// };


const registerUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const payload = req.body;

  const user = await userServcie.registerUserIntoDB(payload);

  //  res.status(httpStatus.CREATED).json({
  //       success: true,
  //       statusCode: httpStatus.CREATED,
  //       message: "User registerd Successfully",
  //       data: {
  //         user,
  //       },
  //     })

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "user registeered successfully",
    data: {user}
  })
})



const getMyProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {


  const {accessToken} = req.cookies;
  console.log(accessToken);

  const verifiedToken = jwtUtils.verifiyToken(accessToken, config.jwt_access_secret)

  if (typeof verifiedToken === "string") {
    throw new Error(verifiedToken)
  }

  const profile = await userServcie.getMyProfileFromDB(verifiedToken.id)
  
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "user profile fetched",
    data: {profile}
  })

})



export const userController = {
  registerUser,
  getMyProfile
  
}

