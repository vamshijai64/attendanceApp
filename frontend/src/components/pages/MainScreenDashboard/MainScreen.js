import { useState } from "react";
import styles from './MainScreen.module.scss';
import MenuBar from "../SideMenuBar/MenuBar";
import Register from "../MainScreenPages/Register/Register";
import Profile from "../MainScreenPages/ProfileUpdate/Profile";
import UpdatePassword from "../Header/UpdatePassword/UpdatePassword";
import Header from "../Header/Header";
import Attendance from "../MainScreenPages/AttendanceMark/Attendance";
import ByID from "../MainScreenPages/AttendancebyID/ByID";

function MainScreen({user}) {

    const [activeView, setActiveView] = useState();

    const handleMenuClick = (view) => {
        setActiveView(view);
    }
    return(
        <div>
            <MenuBar onMenuClick={handleMenuClick} /> {/* Passing function to Menubar */}
            <Header onMenuClick={handleMenuClick} user={user}/>
            <div className={styles.mainContent}>
                {activeView==='registration' && <Register />}
                {activeView === 'profile' && <Profile />}
                {activeView === 'attendance' && <Attendance />}
                {activeView === 'report-designated' && <ByID />}
                {activeView === 'updatePassword' && <UpdatePassword currentUserEmail={user?.email}/>}
            </div>
        </div>
    )
}

export default MainScreen;