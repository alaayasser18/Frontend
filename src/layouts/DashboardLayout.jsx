import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { NotificationProvider } from "../context/NotificationContext";

const DashboardInner = () => {
  const { currentUser } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // الدور حاليًا بيتحدد من مسار الـ URL مؤقتًا لحد ما يتوصل بالـ Backend/Auth الحقيقي
  const roleFromPath = location.pathname.split("/")[1];
  const knownRoles = ["admin", "hr", "manager", "employee"];
  const currentUserRole = knownRoles.includes(roleFromPath)
    ? roleFromPath
    : "admin";

  return (
    <NotificationProvider currentUserId={currentUser?.userId}>
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
          <Header onToggleMenu={() => setMobileMenuOpen((prev) => !prev)} />

          <main
            className="
              flex-1
              overflow-y-auto
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
  return (
    <AuthProvider>
      <DashboardInner />
    </AuthProvider>
  );
};

export default DashboardLayout;
