import { NextApiRequest, NextApiResponse } from "next";
import stripe from '../../services/stripe';
import { getSession } from 'next-auth/react';
import fauna from '../../services/fauna';
import { query as q } from 'faunadb';

type User = {
    ref: {
        id: string;
    }
    data: {
        stripe_customer_id: string;
    }
}

const subscribe = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'post') {
        const { user } = await getSession({ req });

        const currentUser = await fauna.query<User>(
            q.Get(
                q.Match(
                    q.Index('user_by_email'),
                    q.Casefold(user.email)
                )
            )
        );

        let customerId = currentUser.data.stripe_customer_id;

        if (!customerId) {
            const stripeCustomer = await stripe.customers.create({
                email: user.email,
            });
    
            await fauna.query(
                q.Update(
                    q.Ref(q.Collection('users'), currentUser.ref.id),
                    {
                        data: {
                            stripe_customer_id: stripeCustomer.id
                        }
                    }
                )
            )

            customerId = stripeCustomer.id;
        }

        const stripeCheckoutSession = await stripe.checkout.sessions.create({
            customer: customerId,
            payment_method_types: ['card'],
            billing_address_collection: 'required',
            line_items: [
                { price: 'price_1KuHrXIk6o0U92riBfmEvxK1', quantity: 1 }
            ],
            mode: 'subscription',
            allow_promotion_codes: true,
            success_url: process.env.STRIPE_SUCCESS_URL,
            cancel_url: process.env.STRIPE_CANCEL_URL
        });

        return res.status(200).json({ sessionId: stripeCheckoutSession.id });
    } else {
        res.setHeader('Allow', 'POST');
        res.status(405).end('Method not allowed');
    }
};

export default subscribe;
