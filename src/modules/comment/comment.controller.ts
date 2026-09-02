import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { commentService } from "./comment.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";


const createComment = catchAsync(async (req: Request, res: Response, next: NextFunction) => { 
    const authorId = req.user?.id as string;
    const result = await commentService.createComment(authorId, req.body);
    
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Comment created successfully",
        data: result
    })
})

const getCommentByAuthorId = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
const {authorId} = req.params;
    const result = await commentService.getCommentByAuthorId(authorId as string);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Comment fetched successfully",
        data: result
    })
})

const getCommentByCommentId = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
const {commentId} = req.params;
    const result = await commentService.getCommentByCommentId(commentId as string);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Comment fetched successfully",
        data: result
    })
})

const updateComment = catchAsync(async (req: Request, res: Response, next: NextFunction) => { 
    const user = req.user;
    const { commentId } = req.params;
    const authorId = user?.id as string;
    const payload = req.body;
    const result = await commentService.updateComment(commentId as string, payload, authorId);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Comment updated successfully",
        data: result
    })
})

const deleteComment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    const { commentId } = req.params;
    const authorId = user?.id as string;
    const result = await commentService.deleteComment(commentId as string, authorId);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Comment deleted successfully",
        data: result
    })
})

const moderateComment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { commentId } = req.params;
    const data = req.body
    const result = await commentService.moderateComment(commentId as string, data);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Comment moderated successfully",
        data: result
    })
})


export const commentController = {
    createComment,
    getCommentByAuthorId,
    getCommentByCommentId,
    updateComment,
    deleteComment,
    moderateComment
}