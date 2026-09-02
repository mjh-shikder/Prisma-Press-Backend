import { prisma } from "../../lib/prisma"
import { ICreateCommentPayload, IModerateCommentPayload, IUpdateCommentPayloiad } from "./comment.interface"


const createComment = async (authorId: string, payload: ICreateCommentPayload) => {
    await prisma.post.findUniqueOrThrow({
        where: {
            id: payload.postId
        }
    })

    const comment = await prisma.comment.create({
        data: {
            ...payload,
            authorId
        }
    })

    return comment
}

const getCommentByAuthorId = async (authorId: string) => {
    const comments = await prisma.comment.findMany({
    where: {
        authorId
        },
        orderBy: {createdAt: "desc"},
        include: {
            post: {
                select: {
                    id: true,
                    title: true
                }
            }
        }
    })
    
    return comments
}

const getCommentByCommentId = async (commentId: string) => {
    const comment = await prisma.comment.findUniqueOrThrow({
        where: {
        id: commentId
        },
        include: {
            post: {
                select: {
                    id: true,
                    title: true,
                    views: true
                }
            }
        }
    })
    
    return comment
}

const updateComment = async (commentId: string, data: IUpdateCommentPayloiad, authorId: string) => {
    const commentData = await prisma.comment.findFirstOrThrow({
        where: {
            id: commentId,
            authorId
        },
        select: {
            id: true
        }
    })

    if (!commentData) {
        throw new Error("Comment not found or you are not the author of this comment")
    }
        
    const comment = await prisma.comment.update({
        where: {
            id: commentId,
            authorId
        },
        data
    })

    return comment

}


const deleteComment = async (commetId: string, authorId: string) => {
    const commentData = await prisma.comment.findUniqueOrThrow({
        where: {
            id: commetId,
            authorId
        },
        select: {
            id: true
        }
    })
    
    const comment = await prisma.comment.delete({
        where: {
           id: commetId,
       }
    })
    
    return null;

}

const moderateComment = async (commentId: string, data: IModerateCommentPayload) => {
    const commentData = await prisma.comment.findUniqueOrThrow({
        where: {
            id: commentId
        },
        select: {
            id: true,
            status: true
        }
        
    });

    if (commentData.status === data.status) {
    throw new Error(`Comment is already ${data.status}`);
    }
    
    const comment = await prisma.comment.update({
        where: {
            id: commentId
        },
        data
    })

    return comment;
}


export const commentService = {
    createComment,
    getCommentByAuthorId,
    getCommentByCommentId,
    updateComment,
    deleteComment,
    moderateComment
}