import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";
import { postController } from "./post.controller";


const router = Router()

router.post("/", auth(Role.USER, Role.ADMIN, Role.AUTHOR), postController.createPost)

router.get("/", postController.getAllPosts)

router.get("/status", auth(Role.ADMIN), postController.getPostsStatus);

router.get("/my-posts", auth(Role.USER, Role.ADMIN, Role.AUTHOR), postController.getMyPosts)

router.get("/:postId", postController.getPostById)

router.patch("/:postId", auth(Role.USER, Role.ADMIN, Role.AUTHOR), postController.updatePost)

router.delete("/:postId", auth(Role.USER, Role.ADMIN, Role.AUTHOR), postController.deletePost)

export const postRoutes = router;