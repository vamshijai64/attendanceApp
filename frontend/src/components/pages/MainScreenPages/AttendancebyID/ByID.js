import React, { useState, useEffect } from 'react';
import styles from './ByID.module.scss';
import axiosInstance from '../../../../axiosInstance';

const AttendanceTable = () => {
    const [month, setMonth] = useState(new Date().getMonth());
    const [year, setYear] = useState(new Date().getFullYear());
    const [searchText, setSearchText] = useState('');
    const [attendanceData, setAttendanceData] = useState(null);
    const [error, setError] = useState('');
    const [employeeName, setEmployeeName] = useState('');
    const [approvedLeaves, setApprovedLeaves] = useState(0);
    const [unapprovedLeaves, setUnapprovedLeaves] = useState(0);

    const handleMonthChange = (e) => setMonth(parseInt(e.target.value, 10));
    const handleYearChange = (e) => setYear(parseInt(e.target.value, 10));

    const handleSearch = async () => {
        if (!searchText.trim()) {
            setError('Please enter an Employee ID.');
            setAttendanceData(null);
            setEmployeeName('');
            return;
        }

        const normalizedEmployeeID = searchText.trim().toUpperCase();
        try {
            // Reset states before making API calls
            setError('');
            setAttendanceData(null);
            setEmployeeName('');
            setApprovedLeaves(0);
            setUnapprovedLeaves(0);

            // Fetch attendance data
            const attendanceResponse = await axiosInstance.get(
                `/api/attendance/${normalizedEmployeeID}`,
                { params: { month: month + 1, year } }
            );

            if (!attendanceResponse.data || !attendanceResponse.data.data) {
                setError(attendanceResponse.data.message || `No attendance record found for Employee ID ${normalizedEmployeeID} on ${month + 1}/${year}.`);
                return;
            }

            const attendanceArray = attendanceResponse.data.data;
            setAttendanceData(attendanceArray);

            // Fetch employee details
            const employeeResponse = await axiosInstance.get(`/emp/read/Employee_ID/${searchText}`);
            if (!employeeResponse.data) {
                setEmployeeName('Unknown');
            } else {
                setEmployeeName(employeeResponse.data.Employee_Name || 'Unknown');
            }
        } catch (err) {
            console.error(err);
            const errorMessage = err.response?.data?.message || 'Error fetching attendance data.';
            setError(errorMessage);
        }
    };

    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const transformAttendanceData = (data) => {
        const attendanceMap = {};
        let approved = 0;
        let unapproved = 0;

        data.forEach((record) => {
            const date = new Date(record.Date);
            if (date.getMonth() === month && date.getFullYear() === year) {
                const checkIn = record.Check_In ? new Date(`1970-01-01T${record.Check_In}`) : null;
                const checkOut = record.Check_Out ? new Date(`1970-01-01T${record.Check_Out}`) : null;

                const durationInMinutes = checkIn && checkOut ? (checkOut - checkIn) / (1000 * 60) : 0;
                const hours = Math.floor(durationInMinutes / 60);
                const minutes = Math.round(durationInMinutes % 60);
                const formattedDuration = `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;

                if (record.Status === 'Absent' && record.Leave_Type) {
                    if (record.Leave_Type === 'Approved') {
                        approved++;
                    } else if (record.Leave_Type === 'Unapproved') {
                        unapproved++;
                    }
                }

                attendanceMap[date.getDate()] = {
                    status: record.Status,
                    duration: formattedDuration,
                };
            }
        });

        return { attendanceMap, approved, unapproved };
    };

    useEffect(() => {
        if (attendanceData) {
            const { approved, unapproved } = transformAttendanceData(attendanceData);
            setApprovedLeaves(approved);
            setUnapprovedLeaves(unapproved);
        }
    }, [attendanceData, month, year]);

    const mapStatus = (status) => {
        if (status === 'Present') return 'P';
        if (status === 'Absent') return 'A';
        if (status === 'Halfday') return 'HD';
        return 'NA';
    };

    const calculateTotalPresent = (attendanceMap) => {
        return Object.values(attendanceMap).reduce((total, day) => {
            if (day.status === 'Present') {
                return total + 1;
            } else if (day.status === 'Halfday') {
                return total + 0.5;
            }
            return total;
        }, 0);
    };

    const { attendanceMap } = attendanceData
        ? transformAttendanceData(attendanceData)
        : { attendanceMap: {}, approved: 0, unapproved: 0 };

    const getWeekdayName = (day) => {
        const date = new Date(year, month, day);
        return date.toLocaleString('default', { weekday: 'short' });
    };

    return (
        <div className={styles.attendanceTable}>
            <div className={styles.modalHeader}>Search Attendance by ID</div>
            <div className={styles.controls}>
                <input
                    type="text"
                    placeholder="Enter Employee ID"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className={styles.searchBar}
                />
                <button onClick={handleSearch} className={styles.searchButton}>
                    Search
                </button>
                <select value={month} onChange={handleMonthChange} className={styles.dropdown}>
                    {Array.from({ length: 12 }).map((_, i) => (
                        <option key={i} value={i}>
                            {new Date(0, i).toLocaleString('default', { month: 'long' })}
                        </option>
                    ))}
                </select>
                <select value={year} onChange={handleYearChange} className={styles.dropdown}>
                    {Array.from({ length: 20 }).map((_, i) => (
                        <option key={i} value={2024 + i}>
                            {2024 + i}
                        </option>
                    ))}
                </select>
            </div>

            {error && <p className={styles.error}>{error}</p>}

            {attendanceData && (
                <>
                    <table>
                        <thead>
                            <tr>
                                <th rowSpan={2}>Employee ID</th>
                                {Array.from({ length: daysInMonth }).map((_, i) => (
                                    <th key={i}>{i + 1}</th>
                                ))}
                                <th rowSpan={2} style={{color: 'violet'}}>Total Present</th>
                            </tr>
                            <tr>
                                {Array.from({ length: daysInMonth }).map((_, i) => (
                                    <th key={i}>{getWeekdayName(i + 1)}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{searchText}</td>
                                {Array.from({ length: daysInMonth }).map((_, i) => {
                                    const dayData = attendanceMap[i + 1];
                                    const status = dayData ? mapStatus(dayData.status) : '-';
                                    return (
                                        <td
                                            key={i}
                                            className={
                                                status === 'P'
                                                    ? styles.present
                                                    : status === 'A'
                                                    ? styles.absent
                                                    : status === 'HD'
                                                    ? styles.Halfday
                                                    : ''
                                            }
                                        >
                                            {status}
                                        </td>
                                    );
                                })}
                                <td>{calculateTotalPresent(attendanceMap)}</td>
                            </tr>
                            <tr>
                                <td>Duration (hh:mm)</td>
                                {Array.from({ length: daysInMonth }).map((_, i) => {
                                    const dayData = attendanceMap[i + 1];
                                    return <td key={i}>{dayData ? dayData.duration : '0:00'}</td>;
                                })}
                                <td>
                                    {Object.values(attendanceMap)
                                        .reduce((total, day) => total + parseFloat(day.duration || 0), 0)
                                        .toFixed(2)}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <br />
                    <div className={styles.leaveInfo}>
                        <h3>Leave Information</h3>
                        <p className="approved">
                            <strong>Approved Leaves:</strong> {approvedLeaves}
                        </p>
                        <p className="unapproved">
                            <strong>Unapproved Leaves:</strong> {unapprovedLeaves}
                        </p>
                    </div>
                </>
            )}
        </div>
    );
};

export default AttendanceTable;
