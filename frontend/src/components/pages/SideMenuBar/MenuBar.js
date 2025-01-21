import { useState } from 'react';
import styles from './MenuBar.module.scss';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import { MdOutlineSummarize } from "react-icons/md";

function MenuBar({onMenuClick}) {
    const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);

    return (
        <div className={styles.menubar}>
            <h1>Employee Attendance</h1>
            <nav>
                <p onClick={() => onMenuClick("registration")}><AppRegistrationIcon/>Register</p>

                <p onClick={() => onMenuClick("profile")}><PeopleAltIcon/>Profile</p>
                <p onClick={() => onMenuClick("attendance")}><HowToRegIcon/>Attendance</p>

                <p onClick={() => onMenuClick("report-designated")}><MdOutlineSummarize />Attendance by ID</p>
                <p onClick={() => onMenuClick("report-all")}><MdOutlineSummarize />Attendance by All</p>
                
            </nav>
        </div>
    );
}

export default MenuBar;
