import { prisma } from "../../lib/prisma";
import { ICreatePostPayload, IUpdatePostPayload } from "./post.interface";

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

const getMyPosts = async (authorId: string) => {
  const result = await prisma.post.findMany({
    where: {
      authorId,
    },

    orderBy: {
      createdAt: "desc",
    },

    include: {
      comments: true,
      author: {
        omit: {
          password: true,
          createdAT: true,
          updatedAt: true,
        },
      },
      _count: {
        select: {
          comments: true,
        },
      },
    },
  });

  return result;
};

const updatePost = async (
  postId: string,
  payload: IUpdatePostPayload,
  authorId: string,
  isAdmin: boolean,
) => {
  const post = await prisma.post.findUniqueOrThrow({
    where: {
      id: postId,
    },
  });

  if (!isAdmin && post.authorId !== authorId ) {
    throw new Error("You are not authorized to update this post");
  }

  const result = await prisma.post.update({
    where: {
      id: postId,
    },
    data: payload,
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

  return result;
};


const deletePost = async (postId: string, authorId: string, isAdmin: boolean) => {
  const post = await prisma.post.findUniqueOrThrow({
    where: {
      id: postId,
    },
  });
  

    if (!isAdmin && post.authorId !== authorId ) {
    throw new Error("You are not authorized to update this post");
  }

  const result = await prisma.post.delete({
    where: {
      id: postId,
    },
  });

  return result;

};

const getPostsStatus = () => {};

export const postService = {
  createPost,
  getAllPosts,
  getPostsById,
  updatePost,
  deletePost,
  getPostsStatus,
  getMyPosts,
};
