import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { premiumServices } from "./premium.service";
import HttpStatus from "http-status";


const getPremiumContent = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    
    const result = await premiumServices.getPremiumContent()
    
    sendResponse(res, {
        success: true,
        statusCode: HttpStatus.OK,
        message: "Premium Content Retrived Successfully",
        data: result
    })

})


export const premiumControllerr ={
getPremiumContent
}