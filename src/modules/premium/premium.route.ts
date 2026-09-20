import { Router } from "express";
import { premiumControllerr } from "./premium.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();


router.get(
    "/",
    auth(Role.ADMIN, Role.AUTHOR, Role.USER),
    premiumControllerr.getPremiumContent,
);



export const preiumRoutes = router;