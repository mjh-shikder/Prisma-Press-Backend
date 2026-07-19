import app from "./app";
import { prisma } from "./lib/prisma";
import "dotenv/config";

const PORT = process.env.PORT 

async function main() {
    try {
        await prisma.$connect();
        console.log('connected to database');
        app.listen(PORT, () => {
            console.log(`server is running on port ${PORT}`);
            
        })


    } catch (error) {
        console.log("Error starting the server:", error);
        await prisma.$disconnect();
        process.exit(1);
        
    }
};



main();