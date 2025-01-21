// OtpModal.js
import React, { useState } from 'react';
import styles from './OtpModal.module.scss';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../axiosInstance';

function OtpModal({ email, closeModal,setUser }) {
    const [otp, setOtp] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmitOtp = async(e) => {
        e.preventDefault();

        try{
                const response = await axiosInstance.post("/auth/validate-otp", {email,otp});
                
                //const data = await response.json();

                if(response.status === 200) {
                    setSuccessMessage(response.data.message); //Showing success msg from backend
                     
                    //Storing token in local storage
                    if(response.data.token) {
                        localStorage.setItem("token", response.data.token);
                        setUser({ email }); // Update the user state after successful OTP validation

                    }
                    console.log("Token:", response.data.token);
                    console.log("Email", email);
                    
                    
                    setTimeout(() => {
                        closeModal(); //closing modal after success
                        navigate('/home', {replace: true});
                    }, 2000);
                } //else {
    //   setErrorMessage(error.response?.data?.message || "An error occurred. Please try again.");
    //             }
        } catch(error){
            setErrorMessage(error.response?.data?.message || "An error occured. Please try again later.");
        }
    };

  return(
    <div className={styles.modalOverlay}>
        <div className={styles.modalContent}>
            <h3>Enter OTP</h3>
            <form onSubmit={handleSubmitOtp}>
                <div className={styles.text}>
                    <label>OTP:
                        <input 
                            type="text"
                            name='otp'
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            placeholder='Enter OTP'
                        />
                    </label>
                </div>

                <center>
                    <div className={styles.button}><button type='submit'>Submit</button></div>
                </center>
            </form>

            {errorMessage && <p className={styles['error-message']}>{errorMessage}</p>}
            {successMessage && <p className={styles['success-message']}>{successMessage}</p>}

            {/* Close button to close the modal */}
            <button onClick={closeModal} className={styles.closeBtn}>Close</button>
        </div>
    </div>
  )
}

export default OtpModal;
