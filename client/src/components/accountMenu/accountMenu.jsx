import react from 'react';
import Styles from '../accountMenu/accountMenu.module.css';
import { NavLink } from 'react-router-dom';
import Registration from '../../pages/publicRoutes/registration';

function AccountMenu() {
    return (
        <div>
            <div className={Styles.register}>
                <ul>
                    <li><NavLink to='/register'>Register</NavLink></li>
                    <li><NavLink to='/login'>Login</NavLink></li>
                </ul>

            </div>
        </div>
    );
};

export default AccountMenu;


