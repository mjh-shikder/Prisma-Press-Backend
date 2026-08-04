import { NextFunction, Request, RequestHandler, Response } from "express";
import httpStatus from "http-status";
import { userServcie } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";




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

   res.status(httpStatus.CREATED).json({
        success: true,
        statusCode: httpStatus.CREATED,
        message: "User registerd Successfully",
        data: {
          user,
        },
      })
})

export const userController = {
    registerUser
}