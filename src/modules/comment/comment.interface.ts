import { CommentStatus } from "../../../generated/prisma/enums";

export interface ICreateCommentPayload {
    postId: string;
    authorId: string;
    content: string;
}


export interface IUpdateCommentPayloiad {
    content?: string;
    status?: CommentStatus;
}   


export interface IModerateCommentPayload{
    status: CommentStatus;
}