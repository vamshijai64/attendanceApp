import { useState } from 'react';
import styles from './ForgotPassword.module.scss';

function ForgotPassword({ closeModal, openResetModal, setResetEmail }) {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch("http://127.0.0.1:5000/auth/forget-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
  
      const data = await response.json();
      console.log('Response Status:', response.status);

      if (response.status === 200) {
        // If email is valid, proceed to ResetPassword modal
        setMessage(data.message || 'OTP sent');
        setResetEmail(email); // Pass email to ResetPassword component
        setTimeout(() => {
          closeModal(); // Close ForgotPassword modal
          openResetModal(); // Open ResetPassword modal
        }, 500);
      } else if (response.status === 404) {
        // If email is invalid, stay on ForgotPassword modal and show error
        setMessage(data.message || 'Invalid email. Please try again.');
      } else {
        // Handle other errors
        setMessage(data.message || 'An error occurred. Please try again.');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      setMessage('An error occurred. Please try again.');
    }
  };
  

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <h2>Forgot Password</h2>
        <p>Enter your email to reset the password</p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className={styles.actions}>
          <button type="submit">Submit</button>
            <button type="button" onClick={closeModal}>
              Close
            </button>
            
          </div>
        </form>
        {message && <p>{message}</p>} {/* Display success/error message */}
      </div>
    </div>
  );
}

export default ForgotPassword;
