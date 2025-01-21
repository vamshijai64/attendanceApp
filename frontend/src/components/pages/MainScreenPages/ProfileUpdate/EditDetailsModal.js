import { useState } from 'react';
import styles from './EditDetailsModal.module.scss';
import axiosInstance from '../../../../axiosInstance';

function EditDetailsModal({ user, onClose }) {
    const [formData, setFormData] = useState({
        Employee_ID: user.Employee_ID,
        Employee_Name: user.Employee_Name,
        DOB: user.DOB || '',
        Email: user.Email,
        Designation: user.Designation,
    });

    const [editedFields, setEditedFields] = useState({}); // Track edited fields

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));

        setEditedFields((prevEditedFields) => ({
            ...prevEditedFields,
            [name]: true, // Mark the field as edited
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Prepare only edited fields to send to the backend
        const updatedData = Object.keys(formData).reduce((acc, key) => {
            if (editedFields[key]) {
                acc[key] = formData[key];
            }
            return acc;
        }, {});
    
        if (Object.keys(updatedData).length === 0) {
            alert("No changes detected to save.");
            return;
        }
    
        console.log("Data Being Sent:", updatedData); // Debugging log
    
        try {
            // Send the updated data in the PUT request
            const response = await axiosInstance.put(
                `/emp/update/Employee_ID/${formData.Employee_ID}`,
                updatedData // Pass the updated data here
            );
    
            if (response.status === 200 || response.ok) {
                alert('Employee details updated successfully');
                onClose();
            } else {
                console.error("Error Response:", response.data); // Debugging log
                alert('Failed to update user details');
            } 
        } catch (error) {
            console.error("Network Error:", error); // Debugging log
            alert('A network error occurred. Please try again.');
        }
    };
    
    return (
        <div className={styles.modalBackdrop}>
    <div className={styles.modal}>
        <h3>Edit Employee Details</h3>
        <div className={styles.modalContent}>
            <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <label>ID:</label>
                    <input type="text" value={formData.Employee_ID} disabled />
                </div>
                <div className={styles.formGroup}>
                    <label>Name:</label>
                    <input
                        type="text"
                        name="Employee_Name"
                        value={formData.Employee_Name}
                        onChange={handleInputChange}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label>Date of Birth:</label>
                    <input
                        type="date"
                        name="DOB"
                        value={formData.DOB}
                        onChange={handleInputChange}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label>Email:</label>
                    <input
                        type="email"
                        name="Email"
                        value={formData.Email}
                        onChange={handleInputChange}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label>Designation:</label>
                    <input
                        type="text"
                        name="Designation"
                        value={formData.Designation}
                        onChange={handleInputChange}
                    />
                </div>
            
                <div className={styles.modalActions}>
            <button type="submit" className={styles.saveButton}>
                Save
            </button>
            <button type="button" className={styles.cancelButton} onClick={onClose}>
                Cancel
            </button>
        </div>
            </form>
        </div>
        
    </div>
</div>
    );
}

export default EditDetailsModal;
