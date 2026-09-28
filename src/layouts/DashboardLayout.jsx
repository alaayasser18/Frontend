import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { useAuth } from "../context/AuthContext";
import { NotificationProvider } from "../context/NotificationContext";

const DashboardInner = () => {
  const { currentUser } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // ==================== Determine Current User Role ====================
  let currentUserRole = "admin";
  if (location.pathname.startsWith("/employee")) {
    currentUserRole = "employee";
  } else if (location.pathname.startsWith("/hr")) {
    currentUserRole = "hr";
  } else if (location.pathname.startsWith("/manager")) {
    currentUserRole = "manager";
  } else if (location.pathname.startsWith("/admin")) {
    currentUserRole = "admin";
  }

  return (
    <NotificationProvider
      currentRole={currentUserRole}
      currentUserId={currentUser?.id || currentUser?.userId}
    >
      <div className="flex min-h-screen w-full bg-[#f5f7f8]">
        <Sidebar
          role={currentUserRole}
          isOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
        />

        <div
          className="
            ml-[256px]
            flex min-h-screen min-w-0 flex-1 flex-col
            bg-[#f5f7f8]

            max-[760px]:ml-0

            rtl:ml-0
            rtl:mr-[256px]
            rtl:max-[760px]:mr-0
          "
        >
          <Header
            role={currentUserRole}
            onToggleMenu={() =>
              setMobileMenuOpen((prev) => !prev)
            }
          />

          <main
            className="
              flex-1
              px-[38px]
              pt-[34px]
              pb-[50px]

              max-[1050px]:px-[22px]
              max-[1050px]:pt-[28px]
              max-[1050px]:pb-[28px]

              max-[760px]:px-[15px]
              max-[760px]:pt-[24px]
              max-[760px]:pb-[40px]
            "
          >
            <Outlet />
          </main>
        </div>
      </div>
    </NotificationProvider>
  );
};

const DashboardLayout = () => {
  return <DashboardInner />;
};

export default DashboardLayout;
