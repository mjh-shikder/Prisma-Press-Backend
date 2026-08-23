import jwt, { JwtPayload, SignOptions } from "jsonwebtoken"

const createToken = (payload: JwtPayload, secret: string, expiresIn: SignOptions ) => {
    
    const token = jwt.sign(payload, secret, expiresIn);

    return token;
}


//? Verify Token 
const verifiyToken = (token: string, secret: string) => {
   try {
     const verifyingToken = jwt.verify(token, secret);
     return verifyingToken;

   } catch (error: any) {
       console.log(error);
       
       throw new Error(error.message);
   }
}


export const jwtUtils = {
    createToken,
    verifiyToken
}

