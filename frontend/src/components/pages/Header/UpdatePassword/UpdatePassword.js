import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import axiosInstance from "../../../../axiosInstance";
import styles from "./UpdatePassword.module.scss";

function UpdatePassword() {
    const [email, setEmail] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [message, setMessage] = useState("");

    const currentUserEmail = () => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decodedToken = jwtDecode(token); // Decodes the JWT
                return decodedToken.email; // Assumes 'email' exists in the token payload
            } catch (error) {
                console.error("Error decoding token:", error);
            }
        }
        return null;
    };

    useEffect(() => {
        const emailFromToken = currentUserEmail();
        if (emailFromToken) {
            setEmail(emailFromToken);
        }
    }, []);

    const resetForm = () => {
        setOldPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmNewPassword) {
            setMessage("Passwords do not match");
            return;
        }

        const updatePassword = {
            email: email,
            old_password: oldPassword,
            new_password: newPassword,
        };

        try {
            const response = await axiosInstance.post("/auth/update-password", updatePassword);

            if (response.status === 200) {
                setMessage(response.data.message || "Password updated successfully!");
                resetForm();
            } else {
                console.error("Server response error: ", response.data);
                setMessage(response.data.message || "An error occurred");
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            setMessage(
                error.response?.data?.message || "An error occurred while updating the password."
            );
        }
    };

    return (
        <>
            <div className={styles["modal-backdrop"]}></div>
            <div className={styles.modal}>
                <h3>Update Password</h3>
                {message && <p>{message}</p>}
                <form onSubmit={handleUpdatePassword}>
                    <label>
                        Email Id: {email}
                    </label>
                    <label>
                        Old Password:
                        <input
                            type="password"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        New Password:
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        Confirm New Password:
                        <input
                            type="password"
                            value={confirmNewPassword}
                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                            required
                        />
                    </label>
                    <button type="submit">Update</button>
                </form>
            </div>
        </>
    );
}

export default UpdatePassword;
