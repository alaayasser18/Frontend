import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    FiCalendar, FiMapPin, FiArrowRight, FiActivity, FiChevronLeft, FiChevronRight,
    FiCheckSquare, FiClock, FiFileText, FiCpu, FiBell
} from 'react-icons/fi';
import './HomeDashboard.css';

export default function HomeDashboard() {
    const { t } = useTranslation();
    // حالة تسجيل الحضور (true يعني مسجل حضور Checked in، false يعني Checked out)
    const [isCheckedIn, setIsCheckedIn] = useState(true);
    // حالة التحكم في ظهور النافذة المنبثقة للتقويم
    const [showCalendarModal, setShowCalendarModal] = useState(false);

    const handleToggleCheck = () => {
        setIsCheckedIn(!isCheckedIn);
    };

    return (
        <div className="dashboard-container">
            {/* Main Content */}
            <main className="main-content" style={{ marginLeft: 0, width: '100%' }}>
                {/* Dashboard Body */}
                <div className="dashboard-body">
                    {/* Welcome Section */}
                    <div className="welcome-section">
                        <div>
                            <p className="date-label">{t('employee.home.date')}</p>
                            <h1 className="welcome-title">{t('employee.home.welcome')}</h1>
                            <p className="welcome-subtitle">{t('employee.home.subtitle')}</p>
                        </div>
                        <button className="view-calendar-btn" onClick={() => setShowCalendarModal(true)}>
                            <FiCalendar /> {t('employee.home.viewCalendar')}
                        </button>
                    </div>

                    {/* Check-in / Check-out Banner */}
                    <div className="checkin-card">
                        <div className="checkin-left">
                            {isCheckedIn ? (
                                <>
                                    <div className="shift-badge">
                                        <span className="dot"></span> {t('employee.home.onShift')} &nbsp;•&nbsp; {t('employee.home.location')}
                                    </div>
                                    <h2 className="checkin-title">{t('employee.home.checkedIn')}</h2>
                                    <p className="checkin-sub">{t('employee.home.checkedInAt')}</p>
                                    <div className="radius-info">
                                        <FiMapPin /> {t('employee.home.insideRadius')}
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="shift-badge off-shift" style={{ backgroundColor: 'rgba(100, 116, 139, 0.2)', color: '#94a3b8', borderColor: 'rgba(100, 116, 139, 0.3)' }}>
                                        <span className="dot" style={{ backgroundColor: '#94a3b8', boxShadow: 'none' }}></span> {t('employee.home.offShift')} &nbsp;•&nbsp; {t('employee.home.location')}
                                    </div>
                                    <h2 className="checkin-title">{t('employee.home.checkedOut')}</h2>
                                    <p className="checkin-sub">{t('employee.home.shiftEnded')}</p>
                                    <div className="radius-info">
                                        <FiMapPin /> {t('employee.home.checkInFromWorkplace')}
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="checkin-right">
                            <span className="worked-label">{t('employee.home.workedToday')}</span>
                            {/* أرقام ثابتة حسب حالة الـ Check-in */}
                            <div className="timer">{isCheckedIn ? "03:20:51" : "00:00:00"}</div>
                            <button className="checkout-btn" onClick={handleToggleCheck}>
                                {isCheckedIn ? <>{t('employee.home.checkOut')} <FiArrowRight /></> : <>{t('employee.home.checkIn')} <FiArrowRight /></>}
                            </button>
                        </div>
                    </div>

                    {/* Summary Cards Grid */}
                    <div className="summary-grid">
                        <div className="summary-card">
                            <div className="card-header-row">
                                <div className="card-icon blue"><FiCheckSquare /></div>
                                <span>{t('employee.home.pendingTasks')}</span>
                            </div>
                            <h3 className="card-main-val">{t('employee.home.tasks')}</h3>
                            <p className="card-desc">{t('employee.home.highPriority')}</p>
                        </div>

                        <div className="summary-card">
                            <div className="card-header-row">
                                <div className="card-icon orange"><FiClock /></div>
                                <span>{t('employee.home.nextDeadline')}</span>
                            </div>
                            <h3 className="card-main-val">Jun 12</h3>
                            <p className="card-desc">{t('employee.home.operationsReport')}</p>
                        </div>

                        <div className="summary-card">
                            <div className="card-header-row">
                                <div className="card-icon green"><FiCalendar /></div>
                                <span>{t('employee.home.leaveBalance')}</span>
                            </div>
                            <h3 className="card-main-val">{t('employee.home.days')}</h3>
                            <p className="card-desc">{t('employee.home.annualCasual')}</p>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="quick-actions-section">
                        <div>
                            <h3 className="section-title">{t('employee.home.quickActions')}</h3>
                            <p className="section-subtitle">{t('employee.home.shortcuts')}</p>
                        </div>

                        <div className="actions-grid">
                            <div className="action-card">
                                <div className="action-left">
                                    <div className="card-icon green"><FiCalendar /></div>
                                    <span>{t('employee.home.requestLeave')}</span>
                                </div>
                                <FiArrowRight className="arrow-icon" />
                            </div>

                            <div className="action-card">
                                <div className="action-left">
                                    <div className="card-icon blue"><FiFileText /></div>
                                    <span>{t('employee.home.submitTask')}</span>
                                </div>
                                <FiArrowRight className="arrow-icon" />
                            </div>

                            <div className="action-card" onClick={() => setShowCalendarModal(true)}>
                                <div className="action-left">
                                    <div className="card-icon green"><FiCalendar /></div>
                                    <span>{t('employee.home.viewCalendar')}</span>
                                </div>
                                <FiArrowRight className="arrow-icon" />
                            </div>

                            <div className="action-card">
                                <div className="action-left">
                                    <div className="card-icon green"><FiCpu /></div>
                                    <span>{t('employee.home.aiAssistant')}</span>
                                </div>
                                <FiArrowRight className="arrow-icon" />
                            </div>
                        </div>
                    </div>

                    {/* Bottom Grid: Today's Schedule & Recent Activity */}
                    <div className="dashboard-bottom-grid">

                        {/* كارت جدول اليوم */}
                        <div className="dash-card">
                            <div className="dash-card-header-flex">
                                <div>
                                    <h3 className="dash-card-title">{t('employee.home.todaysSchedule')}</h3>
                                    <p className="dash-card-desc">{t('employee.home.upcomingEvents')}</p>
                                </div>
                                <a href="#" className="dash-action-link" onClick={(e) => { e.preventDefault(); setShowCalendarModal(true); }}>{t('employee.home.viewAll')}</a>
                            </div>

                            <div className="schedule-items">
                                <div className="schedule-row">
                                    <span className="sched-time">10:30 AM</span>
                                    <div className="sched-dot blue"></div>
                                    <div className="sched-info">
                                        <strong>{t('employee.home.productSync')}</strong>
                                        <span>{t('employee.home.meetingRoom')}</span>
                                    </div>
                                </div>

                                <div className="schedule-row">
                                    <span className="sched-time">02:00 PM</span>
                                    <div className="sched-dot green"></div>
                                    <div className="sched-info">
                                        <strong>{t('employee.home.focusTime')}</strong>
                                        <span>{t('employee.home.operationsReport')}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* كارت النشاط الأخير */}
                        <div className="dash-card">
                            <div className="dash-card-header-flex">
                                <div>
                                    <h3 className="dash-card-title">{t('employee.home.recentActivity')}</h3>
                                    <p className="dash-card-desc">{t('employee.home.latestUpdates')}</p>
                                </div>
                                <a href="#" className="dash-action-link">{t('employee.home.seeAll')}</a>
                            </div>

                            <div className="activity-items">
                                <div className="activity-row">
                                    <div className="act-icon-box"><FiActivity /></div>
                                    <div className="act-info">
                                        <strong>{t('employee.home.vendorChecklist')}</strong>
                                        <span>{t('employee.home.yesterdayAt432')}</span>
                                    </div>
                                    <span className="act-status-icon">✓</span>
                                </div>

                                <div className="activity-row">
                                    <div className="act-icon-box"><FiBell /></div>
                                    <div className="act-info">
                                        <strong>{t('employee.home.leaveUpdated')}</strong>
                                        <span>{t('employee.home.yesterdayAt910')}</span>
                                    </div>
                                    <span className="act-status-icon">✓</span>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>
            </main>

            {/* نافذة التقويم المنبثقة (Modal) */}
            {showCalendarModal && (
                <div className="calendar-modal-overlay">
                    <div className="calendar-modal-card">

                        <div className="cal-header">
                            <button className="cal-nav-btn"><FiChevronLeft /></button>
                            <h3 className="cal-month-title">{t('employee.home.month')}</h3>
                            <button className="cal-nav-btn"><FiChevronRight /></button>
                        </div>

                        <div className="cal-weekdays">
                            <span>{t('employee.home.weekdays.sun')}</span><span>{t('employee.home.weekdays.mon')}</span><span>{t('employee.home.weekdays.tue')}</span><span>{t('employee.home.weekdays.wed')}</span><span>{t('employee.home.weekdays.thu')}</span><span>{t('employee.home.weekdays.fri')}</span><span>{t('employee.home.weekdays.sat')}</span>
                        </div>

                        <div className="cal-days-grid">
                            <span className="cal-day muted"></span>
                            <span className="cal-day muted"></span>
                            <span className="cal-day muted"></span>
                            <span className="cal-day muted"></span>
                            <span className="cal-day muted"></span>
                            <span className="cal-day">1</span>
                            <span className="cal-day">2</span>

                            <span className="cal-day">3</span>
                            <span className="cal-day">4</span>
                            <span className="cal-day">5</span>
                            <span className="cal-day">6</span>
                            <span className="cal-day">7</span>
                            <span className="cal-day">8</span>
                            <span className="cal-day">9</span>

                            <span className="cal-day">10</span>
                            <span className="cal-day">11</span>
                            <span className="cal-day">12</span>
                            <span className="cal-day">13</span>
                            <span className="cal-day active-leave">
                                14
                                <span className="leave-dot"></span>
                            </span>
                            <span className="cal-day">15</span>
                            <span className="cal-day">16</span>

                            <span className="cal-day">17</span>
                            <span className="cal-day">18</span>
                            <span className="cal-day">19</span>
                            <span className="cal-day">20</span>
                            <span className="cal-day">21</span>
                            <span className="cal-day">22</span>
                            <span className="cal-day">23</span>

                            <span className="cal-day">24</span>
                            <span className="cal-day">25</span>
                            <span className="cal-day">26</span>
                            <span className="cal-day">27</span>
                            <span className="cal-day">28</span>
                            <span className="cal-day">29</span>
                            <span className="cal-day">30</span>

                            <span className="cal-day">31</span>
                        </div>

                        <div className="cal-footer">
                            <div className="cal-legend">
                                <div className="legend-item">
                                    <span className="legend-circle green-border"></span>
                                    <span>{t('employee.home.casualLeave')}</span>
                                </div>
                                <div className="legend-item">
                                    <span className="legend-circle gray-border"></span>
                                    <span>{t('employee.home.upcomingLeave')}</span>
                                </div>
                            </div>

                            <button className="cal-close-btn" onClick={() => setShowCalendarModal(false)}>
                                {t('employee.home.close')}
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}