import { useState } from 'react';
import styles from './Register.module.scss';
import axiosInstance from '../../../../axiosInstance';

function Register() {
    const [id, setId] = useState('');
    const [ename, setName] = useState('');
    const [doj, setDOJ] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [designation, setDesignation] = useState('');

    // For resetting form fields
    const resetForm = () => {
        setId('');
        setName('');
        setDOJ('');
        setEmail('');
        setDesignation('');
        
    };

    // Form submitting
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const employeeData = {
            Employee_ID: id,
            Employee_Name: ename,
            DOJ: doj,
            Email: email,
            Designation: designation,
        };
    
        try {
           
            console.log("Submitting payload:", employeeData); 

            const response = await axiosInstance.post("/emp/create", employeeData);

            if (response.status === 201 || response.ok) {
                setMessage(response.data.message || 'Employee registered successfully!');
                resetForm(); // Clear the form fields
            } else {
                console.error("Error from server response: ", response.data.message || 'Unknown error');
                setMessage(response.data.message || 'Error occurred');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            setMessage(error.response?.data?.message ||'Error occurred while saving the record');
        }
    };
    

    return (
        <div className={styles.register}>
            <h2>Employee Registration</h2>
            {message && <p>{message}</p>} {/* Display success/error message */}
            <form onSubmit={handleSubmit}>
                <label>
                    Employee ID:
                    <input 
                        type='text'
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Employee Name:
                    <input 
                        type='text'
                        value={ename}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </label>
                <label>
                    DOJ:
                    <input
                        type='date'
                        value={doj}
                        onChange={(e) => setDOJ(e.target.value)}
                    />
                </label>
                <label>
                    Email:
                    <input
                        type='email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value) }
                        required
                    />
                </label>
                <label>
                    Designation:
                    <input 
                        type='text'
                        value={designation}
                        onChange={(e) => setDesignation(e.target.value)}
                    />
                </label>
                <button type='submit'>Register</button>
            </form>
        </div>
    );
}

export default Register;
