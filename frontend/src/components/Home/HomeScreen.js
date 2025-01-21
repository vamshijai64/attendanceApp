import Footer from "../pages/Footer/Footer";
import Header from "../pages/Header/Header";
import MainScreen from "../pages/MainScreenDashboard/MainScreen";
import MenuBar from "../pages/SideMenuBar/MenuBar";

function HomeScreen({ user }) {
    return(
        <div>
            <Header user={user}/>
            <MenuBar />
            <MainScreen />
            <Footer />
        </div>
    )
}

export default HomeScreen;