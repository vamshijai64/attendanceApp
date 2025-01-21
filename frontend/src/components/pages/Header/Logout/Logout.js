import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../../axiosInstance"; // Adjust the import path as needed

function Logout() {
    const navigate = useNavigate();

    useEffect(() => {
        const handleLogout = async () => {
            try {
                const token = localStorage.getItem("token");

                if (token) {
                    // Making the logout API call
                    const response = await axiosInstance.post(
                        "/auth/logout",
                        { email: "dummy-email" }, // Optional: Replace with actual email if required
                        {
                            headers: {
                                Authorization: token,
                            },
                        }
                    );

                    if (response.status === 200 || response.ok) {
                        console.log(response.data.message); // Log the success message
                        // Clear local storage
                        localStorage.removeItem("token");
                        // Redirect to the login page
                        navigate("/");
                    } else {
                        console.error("Logout failed: ", response.data.message || "Unknown error");
                    }
                } else {
                    console.warn("No token found in local storage.");
                    navigate("/"); // Redirect to login page if no token
                }
            } catch (error) {
                console.error("Error during logout: ", error.response?.data || error.message);
                navigate("/"); // Redirect to login even if error occurs
            }
        };

        handleLogout();
    }, [navigate]);

    return <p>Logging you out...</p>;
}

export default Logout;
