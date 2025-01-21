import { RiAdminFill } from "react-icons/ri";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from './Header.module.scss';

function Header({ onMenuClick, user }) {
    const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleUpdatePasswordClick = () => {
        onMenuClick('updatePassword');  // Triggering function to set activeView
    };

    const handleLogout = () => {
        // Remove token from localStorage
        localStorage.removeItem("token");
        // Redirect to login page
        navigate("/");
    };

    return (
        <div className={styles.header}>
            <div 
                className={styles.icon}  
                onMouseEnter={() => setIsSubmenuOpen(true)} 
                onMouseLeave={() => setIsSubmenuOpen(false)}
            >
                <RiAdminFill />
                Admin
                {isSubmenuOpen && (
                    <div className={styles.submenu}>
                        <div 
                            className={styles.submenuItem}
                            onClick={handleUpdatePasswordClick}
                        >
                            Update Password
                        </div>
                        <div 
                            className={styles.submenuItem}
                            onClick={handleLogout} // Call the logout function here
                        >
                            Logout
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Header;
