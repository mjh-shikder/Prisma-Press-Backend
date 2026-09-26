import { NextFunction, Request, Response, Router } from "express";
import { premiumControllerr } from "./premium.controller";
import { auth } from "../../middlewares/auth";
import { Role, SubscriptionStatus } from "../../../generated/prisma/enums";
import { catchAsync } from "../../utils/catchAsync";
import { prisma } from "../../lib/prisma";
import { subscriptionGuard } from "../../middlewares/premiumGuard";

const router = Router();


router.get(
    "/",
    auth(Role.ADMIN, Role.AUTHOR, Role.USER),
    subscriptionGuard(),
    premiumControllerr.getPremiumContent,
);



export const preiumRoutes = router;