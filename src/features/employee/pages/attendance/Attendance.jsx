import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    FiMapPin, FiArrowRight, FiChevronDown
} from 'react-icons/fi';
import './Attendance.css';

export default function Attendance() {
    const { t } = useTranslation();
    const [isCheckedIn, setIsCheckedIn] = useState(true);

    const handleToggleCheck = () => {
        setIsCheckedIn(!isCheckedIn);
    };

    const attendanceLogs = t('employee.attendancePage.logs', { returnObjects: true });

    return (
        <div className="dashboard-container" style={{ padding: 0, margin: 0 }}>
            {/* Main Content */}
            <main className="main-content" style={{ width: '100%', padding: 0 }}>

                {/* Dashboard Body */}
                <div className="dashboard-body">
                    {/* Header Title Section */}
                    <div className="welcome-section" style={{ marginBottom: '4px' }}>
                        <div>
                            <p className="date-label" style={{ color: '#16a34a', marginBottom: '6px' }}>{t('employee.attendancePage.label')}</p>
                            <h1 className="welcome-title" style={{ fontSize: '28px' }}>{t('employee.attendancePage.title')}</h1>
                            <p className="welcome-subtitle">{t('employee.attendancePage.subtitle')}</p>
                        </div>
                    </div>

                    {/* Top Two Cards Grid */}
                    <div className="attendance-top-grid">
                        {/* Left Card: Workday status */}
                        <div className="att-card">
                            <div className="att-card-header">
                                <div>
                                    <h3 className="att-card-title">{t('employee.attendancePage.workdayStatus')}</h3>
                                    <p className="att-card-desc">{t('employee.attendancePage.locationValidation')}</p>
                                </div>
                                <span className="gps-badge">{t('employee.attendancePage.validGps')}</span>
                            </div>

                            {/* Radar Map Graphic */}
                            <div className="radar-box">
                                <div className="radar-circle c1"></div>
                                <div className="radar-circle c2"></div>
                                <div className="radar-circle c3"></div>
                                <div className="radar-center-pin">
                                    <FiMapPin />
                                </div>
                            </div>

                            <div className="radar-text-info">
                                <strong>{t('employee.attendancePage.insideRadius')}</strong>
                                <span>{t('employee.attendancePage.location')}</span>
                            </div>

                            <button className="checkout-btn-full" onClick={handleToggleCheck}>
                                {isCheckedIn ? <>{t('employee.home.checkOut')} <FiArrowRight /></> : <>{t('employee.home.checkIn')} <FiArrowRight /></>}
                            </button>

                            <a href="#" className="simulate-link">{t('employee.attendancePage.simulate')}</a>
                        </div>

                        {/* Right Card: Today's summary */}
                        <div className="att-card">
                            <div className="att-card-header" style={{ marginBottom: '16px' }}>
                                <div>
                                    <h3 className="att-card-title">{t('employee.attendancePage.todaySummary')}</h3>
                                    <p className="att-card-desc">{t('employee.attendancePage.date')}</p>
                                </div>
                            </div>

                            <div className="summary-rows">
                                <div className="sum-row">
                                    <span className="sum-label">{t('employee.attendancePage.shift')}</span>
                                    <span className="sum-val">08:45 AM – 05:30 PM</span>
                                </div>
                                <div className="sum-row">
                                    <span className="sum-label">{t('employee.attendancePage.checkIn')}</span>
                                    <span className="sum-val">08:45 AM</span>
                                </div>
                                <div className="sum-row">
                                    <span className="sum-label">{t('employee.attendancePage.breakTime')}</span>
                                    <span className="sum-val">01:00 hour</span>
                                </div>
                                <div className="sum-row" style={{ borderBottom: 'none' }}>
                                    <span className="sum-label">{t('employee.attendancePage.workedToday')}</span>
                                    <span className="sum-val green-num">{isCheckedIn ? "03:20:51" : "00:00:00"}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Attendance History Section */}
                    <div className="history-card">
                        <div className="history-header">
                            <div>
                                <h3 className="att-card-title">{t('employee.attendancePage.history')}</h3>
                                <p className="att-card-desc">{t('employee.attendancePage.recentRecords')}</p>
                            </div>
                            <button className="month-dropdown-btn">
                                {t('employee.attendancePage.month')} <FiChevronDown />
                            </button>
                        </div>

                        <table className="history-table">
                            <thead>
                                <tr>
                                    <th>{t('employee.attendancePage.dateColumn')}</th>
                                    <th>{t('employee.attendancePage.shiftTime')}</th>
                                    <th>{t('employee.attendancePage.duration')}</th>
                                    <th>{t('employee.attendancePage.status')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.isArray(attendanceLogs) && attendanceLogs.map((log) => (
                                    <tr key={log.id}>
                                        <td className="h-date">{log.date}</td>
                                        <td className="h-time">{log.shiftTime}</td>
                                        <td className="h-dur">{log.duration}</td>
                                        <td>
                                            <span className={`h-status ${log.status === t('employee.attendancePage.onTime') ? 'success' : 'warning'}`}>
                                                {log.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                </div>
            </main>
        </div>
    );
}