import React, { useState } from 'react';
import styles from './ResetPassword.module.scss';

function ResetPassword({ closeModal, email }) {
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();

    // Password and confirm password check
    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    setIsLoading(true);
    setMessage(''); // Clear previous messages

    try {
      const response = await fetch("http://127.0.0.1:5000/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp, new_password: newPassword }),
      });

      const data = await response.json();
      setIsLoading(false);

      if (response.ok) {
        setMessage(data.message || 'Password reset successful');
        setOtp('');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(closeModal, 1500); // Close modal after success
      } else {
        setMessage(data.message || 'Invalid OTP or error occurred');
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      setMessage('An error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <h2>Reset Password</h2>
        <p>Email: {email}</p> {/* Display email */}
        <form onSubmit={handleReset}>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <div className={styles.actions}>
            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </button>
            <button type="button" onClick={closeModal} disabled={isLoading}>
              Close
            </button>
          </div>
        </form>
        {message && <p className={message.includes('successful') ? styles.successMessage : styles.errorMessage}>{message}</p>}
      </div>
    </div>
  );
}

export default ResetPassword;
