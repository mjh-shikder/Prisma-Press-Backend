import { title } from "node:process";
import { CommentStatus, PostStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import {
  ICreatePostPayload,
  IPostQuery,
  IUpdatePostPayload,
} from "./post.interface";
import { PostWhereInput } from "../../../generated/prisma/models";
import { log } from "node:console";

const createPost = async (payload: ICreatePostPayload, userId: string) => {
  const result = await prisma.post.create({
    data: {
      ...payload,
      authorId: userId,
    },
  });

  return result;
};

const getAllPosts = async (query: IPostQuery) => {


  const limit = query.limit ? Number(query.limit) : 10;
  const page = query.page ? Number(query.page) : 1;
  const skip = (page - 1) * limit;
  const sortBy = query.sortBy ? query.sortBy : "createdAt";
  const sortOrder = query.sortOrder ? query.sortOrder : "desc";

  const tags = query.tags ? JSON.parse(query.tags as string) : null

  const tagsArry = Array.isArray(tags) ? tags : []

  // console.log(tagsArry);
  
  
  const andConditions: PostWhereInput[] = [];
  if (query.searchTerm) {
    andConditions.push({
      OR: [
        {
          title: {
            contains: query.searchTerm,
            mode: "insensitive",
          },
        },
        {
          content: {
            contains: query.searchTerm,
            mode: "insensitive",
          },
        },
      ],
    });
  }

  if (query.title) {
    andConditions.push({
      title : query.title
    })
  }

  if (query.content) {
    andConditions.push({
      content: query.content
    })
  }

  if (query.authorId) {
    andConditions.push({
      authorId: query.authorId
    })
  }

  if (query.isFeatured) {
    andConditions.push({
      isFeatured : Boolean(query.isFeatured)
    })
  }

  if (query.tags) {
    andConditions.push({
      tags: {
        hasSome: tagsArry
      }
    })
  }

  if (query.status) {
    andConditions.push({
      status: query.status
    })
  }

  const posts = await prisma.post.findMany({
    //? Filtering or Exact match
    // where: {
    //   title: "My 4th Post",
    //   content: "Dhaka",
    // },

    // where: {
    //   AND: [
    //     {
    //       title: "My 4th Post"
    //     },
    //     {
    //       // coontent: "Dhaka"
    //     },
    //     {
    //       tags: {
    //         equals: ["typescript", "prisma", "express"],
    //       }
    //     }
    //   ]
    // },

    //? Searching or Partial match

    // where: {
    //   title: {
    //     contains: "dhaka",
    //     mode: "insensitive"
    //   },
    //* Not Ideal for parital match. Partial match e por por 2 ta feild diya dile oy AND Operator er moto kaj korbe. So, better to use OR operator for partial match.
    // content: {
    //   contains: "dhaka",
    //   mode: "insensitive"
    // }
    // },

    //? Searching or Partial match with OR operator
    // where: {
    //   OR: [
    //     {
    //       title: {
    //         contains: "dhaka",
    //         mode: "insensitive"}
    //     },
    //     {
    //       content: {
    //         contains: "dhaka",
    //         mode: "insensitive"
    //       }
    //     }
    //   ]
    // },

    //?Searching Partial (OR) and Exact match (AND) together
    // where: {
    //   //? Filtering or Exact match
    //   AND: [
    //     {
    //       //? Searching or Partial match with OR operator
    //       OR: [
    //         {
    //           title: {
    //             contains: "dhaka",
    //             mode: "insensitive"
    //           },
    //         },
    //         {
    //           content: {
    //             contains: "dhaka",
    //             mode: "insensitive"
    //           },
    //         },
    //       ],
    //     },
    //     //? Filtering or Exact match
    //     {
    //       title: "dhaka",
    //     },
    //     {
    //       content: "dhaka",
    //     },
    //   ],
    // },

    //* skip = (page - 1) * limit
    // take: 1, // visiting page 1
    // skip: 1, // visiting page 2
    // skip: 2, // visiting page 3

    //? sorting
    // orderBy: {
    //   createdAt: "desc",
    //   title: "asc",
    //   content: "desc",
    // },

    // where: {
    //   AND: [
    //     query.searchTerm
    //       ? {
    //           OR: [
    //             {
    //               title: {
    //                 contains: query.searchTerm,
    //                 mode: "insensitive",
    //               },
    //             },
    //             {
    //               content: {
    //                 contains: query.searchTerm,
    //                 mode: "insensitive",
    //               },
    //             },
    //           ],
    //         }
    //       : {},

    //     query.title ? { title: query.title } : {},

    //     query.content ? { content: query.content } : {},
    //   ],
    // },

    where: {
      AND: andConditions
    },

    take: limit,
    skip: skip,


    orderBy: {
      // sortBy : sortOrder
      // object er moddhe dynamic key value pair set kora jabe na. So, amra [sortBy] diye dynamic key set korbo. 
      [sortBy]: sortOrder,  
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

  return posts;
};

const getPostsById = async (postId: string) => {
  // await prisma.post.update({
  //   where: {
  //     id: postId,
  //   },
  //   data: {
  //     views: { increment: 1 },
  //   },
  // });

  // throw new Error("Fake error to test Sentry integration");

  // const post = await prisma.post.findUniqueOrThrow({
  //   where: {
  //     id: postId,
  //   },
  //   include: {
  //     author: {
  //       omit: {
  //         password: true,
  //       },
  //     },

  //     comments: {
  //       where: {
  //         status: CommentStatus.APPROVED,
  //       },

  //       orderBy: {
  //         createdAt: "desc",
  //       },
  //     },
  //     _count: {
  //       select: {
  //         comments: true,
  //       },
  //     },
  //   },
  // });

  // return post;

  const transactionResult = await prisma.$transaction(async (tx) => {
    await tx.post.update({
      where: {
        id: postId,
      },
      data: {
        views: { increment: 1 },
      },
    });

    // ! Fake error
    // throw new Error("Fake error to test rollback")

    const post = await tx.post.findUniqueOrThrow({
      where: {
        id: postId,
      },
      include: {
        author: {
          omit: {
            password: true,
          },
        },

        comments: {
          where: {
            status: CommentStatus.APPROVED,
          },

          orderBy: {
            createdAt: "desc",
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });

    return post;
  });

  return transactionResult;
};

//* Get My Posts
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

  if (!isAdmin && post.authorId !== authorId) {
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

const deletePost = async (
  postId: string,
  authorId: string,
  isAdmin: boolean,
) => {
  const post = await prisma.post.findUniqueOrThrow({
    where: {
      id: postId,
    },
  });

  if (!isAdmin && post.authorId !== authorId) {
    throw new Error("You are not authorized to update this post");
  }

  await prisma.post.delete({
    where: {
      id: postId,
    },
  });
};

const getPostsStatus = async () => {
  const transactionResult = await prisma.$transaction(async (tx) => {
    // const totalPost = await tx.post.count();

    // const totalPublishedPost = await tx.post.count({
    //   where: {
    //     status: PostStatus.PUBLISHED,
    //   },
    // });

    // const totalDraftPost = await tx.post.count({
    //   where: {
    //     status: PostStatus.DRAFT,
    //   },
    // });

    // const totalArchivedPost = await tx.post.count({
    //   where: {
    //     status: PostStatus.ARCHIVED,
    //   },
    // });

    // const totalComments = await tx.comment.count();

    // const totalApprovedComment = await tx.comment.count({
    //   where: {
    //     status: CommentStatus.APPROVED,
    //   },
    // });

    // const totalRejectedComment = await tx.comment.count({
    //   where: {
    //     status: CommentStatus.REJECT,
    //   },
    // });

    // ? Not a good approach to calculate total post views.
    //   const allPosts = await tx.post.findMany();
    //   let totalPostViews = 0;
    // allPosts.forEach((post) => {
    //   totalPostViews = totalPostViews + post.views;
    // });

    // const totalPostViewsAggregate = await tx.post.aggregate({
    //   _sum: {
    //     views: true,
    //   },
    // });

    // const totalPostViews = totalPostViewsAggregate._sum.views;

    // return {
    //   totalPost,
    //   totalPublishedPost,
    //   totalDraftPost,
    //   totalArchivedPost,
    //   totalComments,
    //   totalApprovedComment,
    //   totalRejectedComment,
    //   totalPostViews
    // }

    const [
      totalPost,
      totalPublishedPost,
      totalDraftPost,
      totalArchivedPost,
      totalComments,
      totalApprovedComment,
      totalRejectedComment,
      totalPostViews,
    ] = await Promise.all([
      await tx.post.count(),
      await tx.post.count({
        where: {
          status: PostStatus.PUBLISHED,
        },
      }),

      await tx.post.count({
        where: {
          status: PostStatus.DRAFT,
        },
      }),

      await tx.post.count({
        where: {
          status: PostStatus.ARCHIVED,
        },
      }),

      await tx.comment.count(),

      await tx.comment.count({
        where: {
          status: CommentStatus.APPROVED,
        },
      }),

      await tx.comment.count({
        where: {
          status: CommentStatus.REJECT,
        },
      }),

      await tx.post.aggregate({
        _sum: {
          views: true,
        },
      }),
    ]);
    return {
      totalPost,
      totalPublishedPost,
      totalDraftPost,
      totalArchivedPost,
      totalComments,
      totalApprovedComment,
      totalRejectedComment,
      totalPostViews: totalPostViews._sum.views,
    };
  });

  return transactionResult;
};

export const postService = {
  createPost,
  getAllPosts,
  getPostsById,
  updatePost,
  deletePost,
  getPostsStatus,
  getMyPosts,
};
