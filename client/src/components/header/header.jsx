// dependency imports
import react, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import ReactDOM from 'react-dom';
import { useLocation } from 'react-router-dom';

// styles, images and logos imports
import styles from '../header/header.module.css';
import logo from '../../assets/logo2.jpg';
import logo_name from '../../assets/logo_name.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faUser, faBars } from '@fortawesome/free-solid-svg-icons';

// compoenent imports
import SearchBar from '../search/search';
import AccountMenu from '../accountMenu/accountMenu';
import Cart from '../cart/cardCard';





function Header() {
    const location = useLocation();
    const [isOpenCat, setIsOpenCat] = useState(false);
    const [isOpenAcc, setIsOpenAcc] = useState(false);
    const [isOpenCart, setIsOpenCart] = useState(false);

    const displayMenu = () => {
        if (isOpenAcc) {
            setIsOpenAcc(!isOpenAcc)
        };
        if (isOpenCart) {
            setIsOpenCart(!isOpenCart)
        };
        setIsOpenCat(!isOpenCat)
    };

    const displayAccount = () => {
        if (isOpenCat) {
            setIsOpenCat(!isOpenCat)
        };
        if (isOpenCart) {
            setIsOpenCart(!isOpenCart)
        };
        setIsOpenAcc(!isOpenAcc)
    };

    const displayCart = () => {
        if (isOpenAcc) {
            setIsOpenAcc(!isOpenAcc)
        };
        if (isOpenCat) {
            setIsOpenCat(!isOpenCat)
        };
        setIsOpenCart(!isOpenCart)
    };



    const openCat = {
        transition: 'all 0.6s ease-in-out',
        transform: isOpenCat ? "translateY(0)" : "translateY(-200%)",
        position: 'absolute',
        zIndex: isOpenCat ? 1000 : -1000
    };

    const openAcc = {
        transition: 'all 0.6s ease-in-out',
        transform: isOpenAcc ? "translateY(0)" : "translateY(-200%)",
        position: 'absolute',
        zIndex: isOpenAcc ? 1000 : -1000
    };

    const openCart = {
        transition: 'all 0.6s ease-in-out',
        transform: isOpenCart ? "translateY(0)" : "translateY(-200%)",
        position: 'absolute',
        zIndex: isOpenCart ? 1000 : -1000
    };


    return (
        <div>
            <div className={styles.navbar}>
                <NavLink to='/'><img src={logo_name} alt='E-Commerce Quick logo' /></NavLink>
                <SearchBar className={styles.search} />
                <div className={styles.btncontainer}>
                    <button onClick={displayCart} className={styles.button}><FontAwesomeIcon icon={faCartShopping} /></button>
                    <button onClick={displayMenu} className={styles.button}><FontAwesomeIcon icon={faBars} /></button>
                    <button onClick={displayAccount} className={styles.button}><FontAwesomeIcon icon={faUser} /></button>
                </div>
            </div>
            <div className={styles.menu_container}>
                <div style={openCat} className={styles.menu}>
                    <ul className={styles.menu}>
                        <li>Categories</li>
                        <li>t-shirt</li>
                        <li>shoes</li>
                        <li>other thing cannot rememeber</li>
                    </ul>
                </div>
                <div style={openAcc} className={styles.menu}>
                    <AccountMenu className={styles.menu} />
                </div>
                <div style={openCart} className={styles.menu}>
                    <Cart className={styles.menu} />
                </div>
            </div>
        </div>
    );
};

export default Header;