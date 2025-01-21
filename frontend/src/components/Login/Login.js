import React, { useState } from "react";
import styles from './Login.module.scss';
import OtpModal from "./OtpModal";
import ForgotPassword from "./ForgotPassword/ForgotPassword";
import ResetPassword from "./ResetPassword/ResetPassword";
import axiosInstance from "../../axiosInstance";
import LockIcon from '@mui/icons-material/Lock';

function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);  // State to track OTP Modal visibility
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false); // State for Forgot Password modal visibility
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState(''); // State to store email for ResetPassword

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.post("/auth/login", {email,password});

      if (response.status === 200) {
        setUser({ email });  // Set the user as authenticated 
        setIsOtpModalOpen(true);  // Open OTP Modal
      }

    } catch (error) {
      setErrorMessage(error.response?.data?.message || "An error occurred. Please try again later.");
    }
  };

  return (
    <div className={styles.login}>
      <div className={styles.header}>
        <h3>Employee Attendance Management</h3>
      </div>
      <div className={styles.modal}>
        <form onSubmit={handleSubmit}>
          <div className={styles.email}>
            <label>Email:
              <input
                type="text"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter Email"
              />
            </label>
          </div>
          <div className={styles.password}>
            <label>Password:
              <input
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Password"
              />
            </label>
          </div>

          <div className={styles.submit}>
            <button type="submit">Submit</button>
          </div>
        </form><br/>
        <div
            className={styles.forgotPasswordButton}
            onClick={() => setIsForgotPasswordOpen(true)}
            role="button"
            tabIndex={0} /* Makes it keyboard accessible */
            onKeyDown={(e) => {
                if (e.key === 'Enter') setIsForgotPasswordOpen(true);
            }}
        >
         
          <span className={styles.forgotPasswordText}>Forgot Password?</span>
        </div>

        {errorMessage && <p className={styles['error-message']}>{errorMessage}</p>}
      </div>

      {/* Render OTP Modal if open */}
      {isOtpModalOpen && (
        <OtpModal 
          email={email} 
          closeModal={() => setIsOtpModalOpen(false)} 
          setUser={setUser} // Pass setUser to OtpModal

        />
      )}

      {/* Render Forgot Password Modal if open */}
      {isForgotPasswordOpen && (
        <ForgotPassword
          closeModal={() => setIsForgotPasswordOpen(false)}
          openResetModal={() => setIsResetPasswordOpen(true)}
          setResetEmail={setResetEmail} // Pass function to update email
        />
      )}

          {/* Render ResetPassword Modal */}
         
        {isResetPasswordOpen && (
          <ResetPassword
            closeModal={() => {
            setIsResetPasswordOpen(false);
            setResetEmail(''); // Clear email state on modal close
          }}
          email={resetEmail} // Pass the email to ResetPassword
        />
        )}
    </div>
  );
}

export default Login;
