import { prisma } from "../../lib/prisma";
import { ICreatePostPayload } from "./post.interface";

const createPost = async (payload: ICreatePostPayload, userId: string) => {
  const result = await prisma.post.create({
    data: {
      ...payload,
      authorId: userId,
    },
  });

  return result;
};

const getAllPosts = async () => {
  const posts = await prisma.post.findMany({
    include: {
      author: {
        omit: {
          password: true,
          createdAT: true,
          updatedAt: true,
        },
      },
      comments: true,
    },
  });

  return posts;
};

const getPostsById = async (postId: string) => {
  const post = await prisma.post.findUniqueOrThrow({
    where: {
      id: postId,
    },
  });

  const updatedPost = await prisma.post.update({
    where: {
      id: postId,
    },
    data: {
      views: { increment: 1 },
    },
    include: {
      author: {
        omit: {
          password: true,
          createdAT: true,
          updatedAt: true,
        },
      },
      comments: true,
    },
  });

  return updatedPost;
};
const updatePost = () => {};

const deletePost = () => {};

const getPostsStatus = () => {};

const getMyPosts = () => {};

export const postService = {
  createPost,
  getAllPosts,
  getPostsById,
  updatePost,
  deletePost,
  getPostsStatus,
  getMyPosts,
};
