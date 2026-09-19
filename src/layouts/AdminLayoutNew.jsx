import {

  FiActivity,
  FiUsers,
  FiHome,
  FiClipboard,
  FiBell,
  FiShield,
  FiGlobe,
  FiMenu,
  FiX,
  FiChevronRight,
} from "react-icons/fi";

const AdminLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#f5f7f8] text-slate-800 font-sans antialiased">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-[#243B53] px-4 py-5 transition-transform lg:static lg:translate-x-0 -translate-x-full">
          <div className="mb-8 flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-xl bg-[#486581] flex items-center justify-center text-white">
                <svg
                  aria-hidden="true"
                  className="size-6"
                  viewBox="0 0 40 40"
                  fill="none"
                >
                  <rect width="40" height="40" rx="12" fill="#486581"></rect>

                  <path
                    d="M11 12h8l4 8 4-8h3L22 29h-4l-7-17Z"
                    fill="white"
                  ></path>

                  <path d="M24 23h7v6h-7z" fill="#79B88B"></path>
                </svg>
              </div>

              <span className="text-lg font-bold tracking-tight text-white">
                Wise<span className="text-[#79B88B]">Work</span>
              </span>
            </div>

            <button
              className="text-[#D9E2EC] lg:hidden"
              aria-label="Close navigation"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>

          <p className="mb-3 px-3 text-[10px] font-bold tracking-[.16em] text-[#9fb3c4]">
            WORKSPACE
          </p>

          <nav className="flex flex-col gap-1">
            {/* Overview */}
            <a
              href="#overview"
              className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-[#D9E2EC] hover:bg-[#334e68] transition-colors"
            >
              <FiActivity className="w-4 h-4" />
              <span>Overview</span>
            </a>
            {/* Users */}
            <a
              href="#users"
              className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-[#D9E2EC] hover:bg-[#334e68] transition-colors"
            >
              <FiUsers className="w-4 h-4" />
              <span>Users</span>
            </a>
            {/* Branches */}
            <a
              href="#branches"
              className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-[#D9E2EC] hover:bg-[#334e68] transition-colors"
            >
              <FiHome className="w-4 h-4" />
              <span>Branches</span>
            </a>
            {/* Performance */}
            <a
              href="#performance"
              className="relative flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium bg-[#486581] text-white"
            >
              <span className="absolute left-0 h-6 w-1 rounded-r-full bg-[#79B88B]"></span>

              <FiClipboard className="w-4 h-4" />

              <span>Performance &amp; Goals</span>

              <FiChevronRight className="w-4 h-4 ml-auto" />
            </a>
            {/* Notifications */}
            <a
              href="#notifications"
              className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-[#D9E2EC] hover:bg-[#334e68] transition-colors"
            >
              <FiBell className="w-4 h-4" />

              <span>Notifications</span>

              <span className="ml-auto rounded-full bg-[#79B88B] px-1.5 py-0.5 text-[10px] font-bold text-[#243B53]">
                3
              </span>
            </a>
            Menna:
            {/* Audit Logs */}
            <a
              href="#audit"
              className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-[#D9E2EC] hover:bg-[#334e68] transition-colors"
            >
              <FiShield className="w-4 h-4" />

              <span>Audit Logs</span>
            </a>
          </nav>

          {/* System Status */}
          <div className="mt-auto rounded-xl border border-[#486581] bg-[#334e68]/60 p-4">
            <div className="mb-3 flex items-center gap-2 text-[#79B88B]">
              <FiGlobe className="w-4 h-4" />

              <span className="text-xs font-bold uppercase tracking-wider">
                Operational
              </span>
            </div>

            <p className="text-sm font-semibold text-white">
              All systems healthy
            </p>

            <p className="mt-1 text-xs leading-5 text-[#D9E2EC]">
              AI gateway and GPS services are online.
            </p>

            <div className="mt-3 h-1.5 rounded-full bg-[#486581]">
              <div className="h-full w-[99%] rounded-full bg-[#79B88B]"></div>
            </div>
          </div>

          <p className="mt-4 text-center text-[10px] text-[#9fb3c4]">
            WiseWork Admin Portal · v1.0.4
          </p>
        </aside>

        {/* Main Content Area */}
        <div className="min-w-0 flex-1">
          {/* Header */}
          <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[#d9e2ec] bg-white/95 px-4 backdrop-blur sm:px-6">
            <div className="flex items-center gap-3">
              <button
                className="rounded-lg p-2 text-[#486581] lg:hidden"
                aria-label="Open navigation"
              >
                <FiMenu className="w-5 h-5" />
              </button>

              <div className="hidden items-center gap-2 text-xs font-semibold text-[#829ab1] lg:flex">
                Administration
                <FiChevronRight className="w-3.5 h-3.5" />
                <span className="text-[#486581]">Performance &amp; Goals</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Production Status */}
              <span className="hidden items-center gap-2 rounded-full bg-[#eef4f0] px-2.5 py-1.5 text-[11px] font-semibold text-[#3f7d5a] sm:flex">
                <span className="size-1.5 rounded-full bg-current"></span>
                Production v1.0
              </span>

              {/* Notification Button */}
              <button
                className="relative rounded-lg p-2 text-[#486581] hover:bg-[#f0f4f7]"
                aria-label="Notifications"
              >
                <FiBell className="w-5 h-5" />

                <span className="absolute right-1.5 top-1.5 size-2 rounded-full border-2 border-white bg-[#b44a4a]"></span>
              </button>

              {/* User Avatar */}
              <div className="flex size-8 items-center justify-center rounded-full bg-[#e7eef5] text-xs font-bold text-[#486581]">
                SA
              </div>
            </div>
          </header>

<div className="hidden items-center gap-2 text-xs font-semibold text-[#829ab1] lg:flex">
Administration
<FiChevronRight className="w-3.5 h-3.5" />
<span className="text-[#486581]">Performance &amp; Goals</span>
</div>
</div>

<div className="flex items-center gap-3">
{/* Production Status */}
<span className="hidden items-center gap-2 rounded-full bg-[#eef4f0] px-2.5 py-1.5 text-[11px] font-semibold text-[#3f7d5a] sm:flex">
<span className="size-1.5 rounded-full bg-current"></span>
Production v1.0
</span>

{/* Notification Button */}
<button
className="relative rounded-lg p-2 text-[#486581] hover:bg-[#f0f4f7]"
aria-label="Notifications"
>
<FiBell className="w-5 h-5" />

<span className="absolute right-1.5 top-1.5 size-2 rounded-full border-2 border-white bg-[#b44a4a]"></span>
</button>

{/* User Avatar */}
<div className="flex size-8 items-center justify-center rounded-full bg-[#e7eef5] text-xs font-bold text-[#486581]">
SA
</div>
</div>
</header>

{/* Main */}
<main className="mx-auto max-w-375 p-4 sm:p-6 lg:p-8">
{children}
</main>
</div>
</div>
</div>
);
          {/* Main */}
          <main className="mx-auto max-w-375 p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
>>>>>>> 017875f9ba194bd73ab530c5c4f6981f4032fcfb
};

export default AdminLayout;
