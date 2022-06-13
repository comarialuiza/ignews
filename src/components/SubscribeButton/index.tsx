import styles from './styles.module.scss';
import { useSession, signIn } from 'next-auth/react';
import api from '../../services/api';
import getStripeJs from '../../services/stripe-js';

interface SubscribeButtonProps {
    priceId: string;
}

const SubscribeButton = ({ priceId }: SubscribeButtonProps) => {
    const { status } = useSession();

    const handleSubscribe = async () => {
        if (status !== 'authenticated') {
            signIn('github');
            return;
        }

        try {
            const response = await api.post('/subscribe');

            const { sessionId } = response.data;

            const stripe = await getStripeJs();
            await stripe.redirectToCheckout({ sessionId });
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <button
            type='button'
            className={ styles.subscribeButton }
            onClick={ handleSubscribe }
        >
            Subscribe now
        </button>
    )
}

export default SubscribeButton;