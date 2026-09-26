import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { prisma } from "../lib/prisma";
import { SubscriptionStatus } from "../../generated/prisma/enums";

 const subscriptionGuard = () => {
    return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.user?.id

        const subscription = await prisma.subscription.findUnique({
            where: {
                userId
            }
        });

        (!subscription){
            throw new Error ("Subscribe to get access to the Premium contents")
        }
        
        if (subscription?.status !== SubscriptionStatus.ACTIVE) {
            throw new Error ("You are not subscribed")
        }

        next()
        
    })
}