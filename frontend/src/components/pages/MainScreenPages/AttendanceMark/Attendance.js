import { useState, useEffect } from "react";
import styles from "./Attendance.module.scss";
import axiosInstance from "../../../../axiosInstance";
import { MdDelete } from "react-icons/md";

function Attendance() {
    const [employees, setEmployees] = useState([]);
    const [checkInStatus, setCheckInStatus] = useState({});
    const [checkOutStatus, setCheckOutStatus] = useState({});
    const [status, setStatus] = useState({});
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [currentDate, setCurrentDate] = useState(new Date().toISOString().split("T")[0]);

    const fetchEmployees = async () => {
            setLoading(true);
            try {
                const response = await axiosInstance.get("/emp/read");
                const employeesData = response.data.data || [];

                const attendanceResponse = await axiosInstance.get("/api/attendance");
                const attendanceData = attendanceResponse.data.data || [];

                // todayDate = new Date().toISOString().split("T")[0];

                const todayAttendance = attendanceData.filter(
                    (attendance) => attendance.Date === currentDate
                );

                const updatedCheckInStatus = {};
                const updatedCheckOutStatus = {};
                const updatedStatus = {};

                todayAttendance.forEach((attendance) => {
                    if (attendance["Check-In"]) {
                        updatedCheckInStatus[attendance.Employee_ID] = attendance["Check-In"];
                    }
                    if (attendance["Check-Out"]) {
                        updatedCheckOutStatus[attendance.Employee_ID] = attendance["Check-Out"];
                    }
                    if (attendance["Status"]) {
                        updatedStatus[attendance.Employee_ID] = attendance["Status"];
                    }
                });

                setCheckInStatus(updatedCheckInStatus);
                setCheckOutStatus(updatedCheckOutStatus);
                setStatus(updatedStatus);

                setEmployees(employeesData);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to fetch employees");
            } finally {
                setLoading(false);
            }
    };

    //Updating date daily
    useEffect(() => {
        const interval = setInterval(() => {
            const newDate = new Date().toISOString().split("T")[0];
            if(newDate !== currentDate) {
                setCurrentDate(newDate);
            }
        }, 1000 * 60 * 60); //Checking every hour

          return () => clearInterval(interval); // Cleanup
    }, [currentDate]);

    //Fetching data when date changes basing on current date
    useEffect(() => {
        fetchEmployees();
    }, [currentDate]);

    const calculateDuration = (checkIn, checkOut) => {
        if (!checkIn || !checkOut) return "-";

        const checkInTime = new Date(`1970-01-01T${checkIn}`);
        const checkOutTime = new Date(`1970-01-01T${checkOut}`);
        const diffInMinutes = Math.floor((checkOutTime - checkInTime) / (1000 * 60));

        if (diffInMinutes < 0) return "-"; // Handle invalid times

        const hours = Math.floor(diffInMinutes / 60);
        const minutes = diffInMinutes % 60;

        return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
    };

    const calculateStatus = (checkIn, checkOut) => {
        const checkInTime = new Date(`1970-01-01T${checkIn}`);
        const checkOutTime = new Date(`1970-01-01T${checkOut}`);
        const timeDifference = (checkOutTime - checkInTime) / (1000 * 60 * 60); // in hours

        if (timeDifference < 3) return "Absent";
        if (timeDifference >= 3 && timeDifference <= 8) return "Halfday";
        return "Present";
    };

    const handleCheckIn = async (employeeId) => {
        try {
            const response = await axiosInstance.post("/api/attendance/checkin", {
                Employee_ID: employeeId,
            });
            const { data } = response.data;

            setCheckInStatus((prevState) => ({
                ...prevState,
                [employeeId]: data["Check-In"],
            }));

            // Initially set status to "Present" upon Check-In
            setStatus((prevState) => ({
                ...prevState,
                [employeeId]: "Present",
            }));
        } catch (err) {
            alert(err.response?.data?.message || "Failed to mark check-in");
        }
    };

    const handleCheckOut = async (employeeId) => {
        const checkInTime = checkInStatus[employeeId];
        const checkOutTime = new Date().toLocaleTimeString("en-GB", {
            hour12: false,
        });

        if (!checkInTime) {
            alert("Employee has not checked in yet.");
            return;
        }

        const calculatedStatus = calculateStatus(checkInTime, checkOutTime);

        try {
            const response = await axiosInstance.put("/api/attendance/checkout", {
                Employee_ID: employeeId,
                Status: calculatedStatus, // Pass calculated status to backend
            });

            const { data } = response.data;

            setCheckOutStatus((prevState) => ({
                ...prevState,
                [employeeId]: data["Check-Out"],
            }));

            setStatus((prevState) => ({
                ...prevState,
                [employeeId]: calculatedStatus,
            }));
        } catch (err) {
            alert(err.response?.data?.message || "Failed to mark check-out");
        }
    };

    const handleLeave = async (employeeId, leaveType) => {
        if (!leaveType) return;
    
        try {
            // Make API call to mark leave
            const response = await axiosInstance.post("/api/attendance/leave", {
                Employee_ID: employeeId,
                Leave_Type: leaveType,
            });
    
            const { data, message } = response.data;
    
            // Update the status to "Absent" in the frontend
            setStatus((prevState) => ({
                ...prevState,
                [employeeId]: "Absent",
            }));
    
            alert(message || "Leave marked successfully.");
        } catch (err) {
            alert(err.response?.data?.message || "Failed to mark leave.");
        }
    };

    const handleDeleteAttendance = async (employeeId) => {
        const fieldsToRemove = [];
        if (checkInStatus[employeeId]) fieldsToRemove.push("Check-In");
        if (checkOutStatus[employeeId]) fieldsToRemove.push("Check-Out");
        if (status[employeeId] === "Absent" || status[employeeId] === "Halfday" || status[employeeId] === "Present") {
            fieldsToRemove.push("Leave_Type");
        }
    
        if (fieldsToRemove.length === 0) {
            alert("No attendance fields to delete for this employee.");
            return;
        }
    
        try {
            const response = await axiosInstance.delete(`/api/attendance/delete/${employeeId}`, {
                data: { fields_to_remove: fieldsToRemove },
            });
    
            alert(response.data.message || "Attendance fields deleted successfully.");
    
            // Update frontend state
            setCheckInStatus((prevState) => {
                const newState = { ...prevState };
                if (fieldsToRemove.includes("Check-In")) delete newState[employeeId];
                return newState;
            });
    
            setCheckOutStatus((prevState) => {
                const newState = { ...prevState };
                if (fieldsToRemove.includes("Check-Out")) delete newState[employeeId];
                return newState;
            });
    
            setStatus((prevState) => {
                const newState = { ...prevState };
                if (fieldsToRemove.includes("Leave_Type")) delete newState[employeeId];
                return newState;
            });
        } catch (err) {
            alert(err.response?.data?.message || "Failed to delete attendance fields.");
        }
    };
    
    const handleAllPresent = async (event) => {
        const isChecked = event.target.checked;

        if (!isChecked) return; // No action on uncheck

        const employeesToCheckIn = employees.filter(
            (employee) => !checkInStatus[employee.Employee_ID] // Only employees without check-in
        );

        try {
            const checkInPromises = employeesToCheckIn.map((employee) =>
                axiosInstance.post("/api/attendance/checkin", {
                    Employee_ID: employee.Employee_ID,
                })
            );

            const responses = await Promise.all(checkInPromises);

            const updatedCheckInStatus = { ...checkInStatus };
            const updatedStatus = { ...status };

            responses.forEach((response, index) => {
                const { data } = response.data;
                const employeeId = employeesToCheckIn[index].Employee_ID;
                updatedCheckInStatus[employeeId] = data["Check-In"];
                updatedStatus[employeeId] = "Present";
            });

            setCheckInStatus(updatedCheckInStatus);
            setStatus(updatedStatus);
        } catch (err) {
            alert(err.response?.data?.message || "Failed to mark all present.");
        }
    };


    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className={styles.modal}>
            <div className={styles.headerContainer}>
                <div className={styles.modalHeader}>Employee Daily Attendance</div>
                <div className={styles.dateDisplay}>Today Date: {new Date().toLocaleDateString()}</div>
            </div>
            <div className={styles.attendance}>
                <div className={styles.tableHeader}>
                    <span>ID</span>
                    <span>Name</span>
                    <span>Designation</span>
                    <span>Check-In</span>
                    <span>Check-Out</span>
                    <span>Total Duration (hh:mm)</span>
                    <span>Status
                        <label>&nbsp;&nbsp;(All Present)<input type="checkbox" onChange={handleAllPresent}/></label>

                    </span>
                    <span>Leave</span>
                    <span>Delete</span>
                </div>
                <div className={styles.tableBody}>
                    {employees.map((employee) => (
                        <div key={employee.Employee_ID} className={styles.tableRow}>
                            <span>{employee.Employee_ID}</span>
                            <span>{employee.Employee_Name}</span>
                            <span>{employee.Designation}</span>
                            <span>
                                {checkInStatus[employee.Employee_ID] ? (
                                    <button className={styles.checkInButton} disabled>
                                        {checkInStatus[employee.Employee_ID]}
                                    </button>
                                ) : (
                                    <button
                                        className={styles.checkInButton}
                                        onClick={() => handleCheckIn(employee.Employee_ID)}
                                    >
                                        Check-In
                                    </button>
                                )}
                            </span>
                            <span>
                                {checkOutStatus[employee.Employee_ID] ? (
                                    <button className={styles.checkOutButton} disabled>
                                        {checkOutStatus[employee.Employee_ID]}
                                    </button>
                                ) : (
                                    <button
                                        className={styles.checkOutButton}
                                        onClick={() => handleCheckOut(employee.Employee_ID)}
                                    >
                                        Check-Out
                                    </button>
                                )}
                            </span>
                            <span>
                                {calculateDuration(
                                    checkInStatus[employee.Employee_ID],
                                    checkOutStatus[employee.Employee_ID]
                                )}
                            </span>
                            <span>&nbsp;&nbsp;{status[employee.Employee_ID] || "-"}</span>
                            <span>
                                <select
                                    className={styles.leaveDropdown}
                                    onChange={(e) => handleLeave(employee.Employee_ID, e.target.value)}
                                    defaultValue=""
                                >
                                    <option value="" disabled>
                                        Select Leave
                                    </option>
                                    <option value="Approved">Approved</option>
                                    <option value="Unapproved">Unapproved</option>
                                </select>
                            </span>
                            <span>
                                <MdDelete
                                    className={styles.deleteButton}
                                    onClick={() => handleDeleteAttendance(employee.Employee_ID)}
                                />
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Attendance;
