import config from "../../config"
import { prisma } from "../../lib/prisma"
import { stripe } from "../../lib/stripe"

const createCheckoutSesstion = async(userId: string, ) => {
    const transactionResult = await prisma.$transaction(async (tx) => {
     
        const user = await tx.user.findUniqueOrThrow({
            where: {
                id: userId
            },
            include: {
                subscription: true
            }
        })

        //old subscriber
        let stripeCustomerId = user.subscription?.stripeCustomerId;
        
        if (!stripeCustomerId) {
            //new subscriber
            const customer = await stripe.customers.create({
              email: user.email,
              name: user.name,
              metadata: { userId: user.id },
            });

            stripeCustomerId = customer.id
        }


        const sesstion = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price: config.stripe_product_Price_id,
                    quantity: 1
                }
            ],
            mode: "subscription",
            customer: stripeCustomerId,
            payment_method_types: ["card"],
            success_url: `${config.app_url}/premium?success=true`,
            cancel_url: `${config.app_url}/premium?success=false`,
            metadata: {userId: user.id}
        })

        return sesstion.url

    })
    
    return {
        paymentUrl: transactionResult
    }
}

export const subscriptionService = {
    createCheckoutSesstion
}