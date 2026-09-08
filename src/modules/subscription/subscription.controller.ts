import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { subscriptionService } from "./subscription.service";
import { sendResponse } from "../../utils/sendResponse";
import  HttpStatus  from "http-status";

const createCheckoutSesstion = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.user?.id

        const result = await subscriptionService.createCheckoutSesstion(userId as string)

        sendResponse(res, {
            success: true, 
            statusCode: HttpStatus.OK,
            message: "Checkout completed successfully",
            data: result

        })
    }
)

export const subscriptionController = {
    createCheckoutSesstion
}