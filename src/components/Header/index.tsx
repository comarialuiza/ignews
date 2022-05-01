import Image from 'next/image';
import styles from './styles.module.scss';
import SignInButton from '../SignInButton';

const Header = () => {
    return (
        <header className={ styles.headerContainer }>
            <div className={ styles.headerContent }>
                <Image src='/images/logo.svg' alt='Ignews' height='100px' width='100px'/>

                <nav>
                    <a className={ styles.active }>Home</a>
                    <a>Posts</a>
                </nav>

                <SignInButton />
            </div>
        </header>
    );
};

export default Header;