import { prisma } from "../../lib/prisma"
import { ICreatePostPayload } from "./post.interface"


const createPost = async (payload: ICreatePostPayload, userId: string) => {
    const result = await prisma.post.create({
        data: {
            ...payload,
            authorId: userId
        }
    })

    return result
}

const getAllPosts = async () => {
    const posts = await prisma.post.findMany(
        {
            include: {
                author: {
                    omit: { 
                        password: true,
                        createdAT: true,
                        updatedAt: true
                    }
                },
                comments: true
            }
        }
    )
    
    return posts
}

const getPostsById = () => {

}

const updatePost = () => {

}

const deletePost = () => { 

}

const getPostsStatus = () => {

}

const getMyPosts = () => {

}


export const postService = {
    createPost,
    getAllPosts,
    getPostsById,
    updatePost,
    deletePost,
    getPostsStatus,
    getMyPosts
}