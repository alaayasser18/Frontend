import { Link, useLocation } from "react-router-dom";
import { FiArrowRight, FiBell, FiClock, FiHome } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import "./EmployeeSidebar.css";

const EmployeeSidebar = () => {
    const { t } = useTranslation();
    const location = useLocation();

    const links = [
        {
            path: "/employee/dashboard",
            label: t("employee.sidebar.homeDashboard"),
            icon: FiHome,
        },
        {
            path: "/employee/attendance",
            label: t("employee.sidebar.myAttendance"),
            icon: FiClock,
        },
    ];

    return (
        <aside className="sidebar employee-sidebar">
            <div className="sidebar-top">
                <div className="logo-area">
                    <div className="logo-icon">W</div>
                    <span>WiseWork</span>
                </div>

                <div className="nav-section">
                    <span className="nav-label">{t("employee.sidebar.portal")}</span>
                    {links.map(({ path, label, icon: Icon }) => (
                        <Link
                            key={path}
                            to={path}
                            className={`nav-item ${location.pathname === path ? "active" : ""}`}
                        >
                            <Icon />
                            {label}
                        </Link>
                    ))}
                </div>
            </div>

            <div className="sidebar-footer">
                <div className="ai-card">
                    <div className="ai-card-content">
                        <h4>{t("employee.sidebar.needAHand")}</h4>
                        <p>{t("employee.sidebar.askAi")}</p>
                    </div>
                    <FiArrowRight />
                </div>

                <div className="user-profile-card">
                    <div className="user-info">
                        <div className="avatar">OH</div>
                        <div>
                            <p className="user-name">{t("employee.sidebar.userName")}</p>
                            <p className="user-role">{t("employee.sidebar.userRole")}</p>
                        </div>
                    </div>
                    <FiBell style={{ color: "#94a3b8", cursor: "pointer" }} />
                </div>
            </div>
        </aside>
    );
};

export default EmployeeSidebar;
