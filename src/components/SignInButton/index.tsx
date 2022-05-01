import { FaGithub } from 'react-icons/fa';
import styles from './styles.module.scss';
import { useState } from 'react';
import { FiX } from 'react-icons/fi';

const SignInButton = () => {
    const [isUserLoggedIn, setIsUserLoggedIn] = useState(true);

    return isUserLoggedIn ? (
        <button type='button' className={ styles.signInButton }>
            <FaGithub color='#04d361' />
            Maria Luiza
            <FiX color='#737380' className={ styles.closeIcon } />
        </button>
    ) : (
        <button type='button' className={ styles.signInButton }>
            <FaGithub color='#eba417' />
            Sign in with GitHub
        </button>
    );
};

export default SignInButton;