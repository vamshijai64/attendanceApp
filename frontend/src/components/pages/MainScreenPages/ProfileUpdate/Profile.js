import { useEffect, useState } from 'react';
import styles from './Profile.module.scss';
import EditDetailsModal from './EditDetailsModal'; 
import axiosInstance from '../../../../axiosInstance';

function Profile() {
    const [users, setUsers] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

    const usersPerPage = 6; // Number of users per page

    useEffect(() => {
        const fetchUsers = async () => {
            try{
                const response = await axiosInstance.get("/emp/read");
                // Extract the "data" key from the response
                const usersData = response.data?.data;
                const data = Array.isArray(usersData) ? usersData : []; // Ensure it's an array
                console.log("API Response:", response.data);
                setUsers(data);
                //return response.data;

            } catch(error){
                console.error('Error fetching users:', error);
                setUsers([]); // Ensure users is an array even if there’s an error
            }
        };
        fetchUsers();
    }, []);

    const handleEditClick = (user) => {
        setSelectedUser(user);
        setIsEditing(true);
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const totalPages = Math.ceil(users.length / usersPerPage);
    const displayedUsers = Array.isArray(users)
    ? users.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage)
    : [];


    return (
        <div className={styles.modal}>
            <div className={styles.modalHeader}>Profile</div>
            <div className={styles.tableHeader}>
                <span>SNo</span>
                <span>ID</span>
                <span>Name</span>
                <span>Designation</span>
                <span>Email</span>
                <span>Details</span>
            </div>
            <div className={styles.tableBody}>
                 
                {displayedUsers.map((user, index) => (
                    <div key={user.Employee_ID} className={styles.tableRow}>
                        <span>{(currentPage - 1) * usersPerPage + index + 1}</span>
                        <span>{user.Employee_ID}</span>
                        <span>{user.Employee_Name}</span>
                        <span>{user.Designation || 'N/A'}</span>
                        <span>{user.Email}</span>
                        <span>
                            <button onClick={() => handleEditClick(user)}>
                                <b>View/Edit</b>
                            </button>
                        </span>
                    </div>
                ))}
                {isEditing && (
                    <EditDetailsModal
                        user={selectedUser}
                        onClose={() => setIsEditing(false)}
                    />
                )}
            </div>
            <div className={styles.pagination}>
                {[...Array(totalPages)].map((_, index) => (
                    <button
                        key={index}
                        onClick={() => handlePageChange(index + 1)}
                        className={
                            index + 1 === currentPage ? styles.activePage : ''
                        }
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default Profile;
