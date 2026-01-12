import { NavLink, Outlet } from "react-router-dom";
import { useState } from "react";

export default function SidebarLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="relative min-h-screen bg-black">
      {/* Note: Atmospheric background comes from body::before in index.css */}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen
        bg-dark-card/95 backdrop-blur-heavy border-r border-white/8
        px-4 md:px-6 py-8 flex flex-col gap-10 z-[100]
        transition-all duration-300 shadow-[4px_0_24px_rgba(139,92,246,0.1)]
        ${isCollapsed ? "w-20 md:w-20" : "w-full md:w-[280px]"}
        md:flex hidden`}
      >
        {/* Collapse Button */}
        <button
          className="absolute -right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-gradient-primary border-2 border-black rounded-full flex items-center justify-center text-white cursor-pointer transition-all duration-300 shadow-primary shadow-primary-lg z-[101] outline-none hover:bg-gradient-primary-dark hover:scale-110 hover:shadow-primary-xl hover:shadow-[0_0_0_4px_rgba(139,92,246,0.2)] active:scale-95"
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-transform duration-300 hover:scale-110"
          >
            {isCollapsed ? (
              <>
                <line x1="17" y1="10" x2="3" y2="10"></line>
                <polyline points="11 6 7 10 11 14"></polyline>
                <line x1="17" y1="14" x2="3" y2="14"></line>
                <polyline points="11 10 7 14 11 18"></polyline>
              </>
            ) : (
              <>
                <line x1="7" y1="10" x2="21" y2="10"></line>
                <polyline points="13 6 17 10 13 14"></polyline>
                <line x1="7" y1="14" x2="21" y2="14"></line>
                <polyline points="13 10 17 14 13 18"></polyline>
              </>
            )}
          </svg>
        </button>

        {/* Brand */}
        <div
          className={`flex items-center pb-6 border-b border-white/8 transition-all duration-300 ${
            isCollapsed ? "justify-center gap-0" : "gap-4"
          }`}
        >
          <div
            className={`min-w-12 w-12 h-12 bg-gradient-primary flex items-center justify-center font-extrabold text-white shadow-primary transition-all duration-300 relative overflow-hidden logo-shine ${
              isCollapsed ? "rounded-2xl" : "rounded-xl"
            }`}
          >
            <span className="relative z-10 text-2xl">G</span>
          </div>

          <div
            className={`transition-all duration-300 overflow-hidden whitespace-nowrap ${
              isCollapsed ? "opacity-0 w-0 invisible" : "opacity-100"
            }`}
          >
            <h3 className="text-[22px] font-bold bg-gradient-text bg-clip-text text-transparent mb-0.5 tracking-tight">
              GigFlow
            </h3>
            <p className="text-[13px] text-white/50 font-normal">Dashboard</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-2 flex-1">
          <NavLink
            to="/gigs"
            data-tooltip="Gigs"
            className={({ isActive }) =>
              `group relative px-[18px] py-3.5 text-white/70 no-underline rounded-xl text-base font-medium transition-all duration-300 overflow-visible flex items-center gap-3 ${
                isCollapsed ? "justify-center px-3.5" : ""
              } ${
                isActive
                  ? "bg-primary/15 text-white shadow-sm before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-0.5 before:h-[60%] before:bg-gradient-primary before:rounded-r-sm"
                  : "hover:bg-primary/10 hover:text-white hover:translate-x-1"
              }`
            }
          >
            <svg
              className={`min-w-5 transition-all duration-300 ${
                isCollapsed
                  ? ""
                  : "group-hover:scale-110 group-hover:drop-shadow-[0_0_4px_rgba(139,92,246,0.6)]"
              }`}
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="7" height="7"></rect>
              <rect x="14" y="3" width="7" height="7"></rect>
              <rect x="14" y="14" width="7" height="7"></rect>
              <rect x="3" y="14" width="7" height="7"></rect>
            </svg>

            <span
              className={`transition-all duration-300 whitespace-nowrap ${
                isCollapsed ? "opacity-0 w-0 absolute invisible" : "opacity-100"
              }`}
            >
              Gigs
            </span>

            {isCollapsed && (
              <span className="absolute left-[calc(100%+20px)] bg-dark-darker/95 backdrop-blur-heavy text-white px-3.5 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap opacity-0 pointer-events-none transition-all duration-300 border border-white/8 shadow-lg z-[200] group-hover:opacity-100 group-hover:left-[calc(100%+16px)]">
                Gigs
              </span>
            )}
          </NavLink>

          <NavLink
            to="/create-gig"
            data-tooltip="Create Gig"
            className={({ isActive }) =>
              `group relative px-[18px] py-3.5 text-white/70 no-underline rounded-xl text-base font-medium transition-all duration-300 overflow-visible flex items-center gap-3 ${
                isCollapsed ? "justify-center px-3.5" : ""
              } ${
                isActive
                  ? "bg-primary/15 text-white shadow-sm before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-0.5 before:h-[60%] before:bg-gradient-primary before:rounded-r-sm"
                  : "hover:bg-primary/10 hover:text-white hover:translate-x-1"
              }`
            }
          >
            <svg
              className={`min-w-5 transition-all duration-300 ${
                isCollapsed
                  ? ""
                  : "group-hover:scale-110 group-hover:drop-shadow-[0_0_4px_rgba(139,92,246,0.6)]"
              }`}
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="16"></line>
              <line x1="8" y1="12" x2="16" y2="12"></line>
            </svg>

            <span
              className={`transition-all duration-300 whitespace-nowrap ${
                isCollapsed ? "opacity-0 w-0 absolute invisible" : "opacity-100"
              }`}
            >
              Create Gig
            </span>

            {isCollapsed && (
              <span className="absolute left-[calc(100%+20px)] bg-dark-darker/95 backdrop-blur-heavy text-white px-3.5 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap opacity-0 pointer-events-none transition-all duration-300 border border-white/8 shadow-lg z-[200] group-hover:opacity-100 group-hover:left-[calc(100%+16px)]">
                Create Gig
              </span>
            )}
          </NavLink>

          <NavLink
            to="/applications"
            data-tooltip="Applications"
            className={({ isActive }) =>
              `group relative px-[18px] py-3.5 text-white/70 no-underline rounded-xl text-base font-medium transition-all duration-300 overflow-visible flex items-center gap-3 ${
                isCollapsed ? "justify-center px-3.5" : ""
              } ${
                isActive
                  ? "bg-primary/15 text-white shadow-sm before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-0.5 before:h-[60%] before:bg-gradient-primary before:rounded-r-sm"
                  : "hover:bg-primary/10 hover:text-white hover:translate-x-1"
              }`
            }
          >
            <svg
              className={`min-w-5 transition-all duration-300 ${
                isCollapsed
                  ? ""
                  : "group-hover:scale-110 group-hover:drop-shadow-[0_0_4px_rgba(139,92,246,0.6)]"
              }`}
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>

            <span
              className={`transition-all duration-300 whitespace-nowrap ${
                isCollapsed ? "opacity-0 w-0 absolute invisible" : "opacity-100"
              }`}
            >
              Applications
            </span>

            {isCollapsed && (
              <span className="absolute left-[calc(100%+20px)] bg-dark-darker/95 backdrop-blur-heavy text-white px-3.5 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap opacity-0 pointer-events-none transition-all duration-300 border border-white/8 shadow-lg z-[200] group-hover:opacity-100 group-hover:left-[calc(100%+16px)]">
                Applications
              </span>
            )}
          </NavLink>

          <NavLink
            to="/settings"
            data-tooltip="Settings"
            className={({ isActive }) =>
              `group relative px-[18px] py-3.5 text-white/70 no-underline rounded-xl text-base font-medium transition-all duration-300 overflow-visible flex items-center gap-3 mt-auto border-t border-white/8 pt-[18px] ${
                isCollapsed ? "justify-center px-3.5" : ""
              } ${
                isActive
                  ? "bg-primary/15 text-white shadow-sm before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-0.5 before:h-[60%] before:bg-gradient-primary before:rounded-r-sm"
                  : "hover:bg-primary/10 hover:text-white hover:translate-x-1"
              }`
            }
          >
            <svg
              className={`min-w-5 transition-all duration-300 ${
                isCollapsed
                  ? ""
                  : "group-hover:scale-110 group-hover:drop-shadow-[0_0_4px_rgba(139,92,246,0.6)]"
              }`}
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M12 1v6m0 6v6m5.2-14.8l-4.2 4.2m0 5.2l-4.2 4.2M23 12h-6m-6 0H1m14.8 5.2l-4.2-4.2m0-5.2L7.4 3.6"></path>
            </svg>

            <span
              className={`transition-all duration-300 whitespace-nowrap ${
                isCollapsed ? "opacity-0 w-0 absolute invisible" : "opacity-100"
              }`}
            >
              Settings
            </span>

            {isCollapsed && (
              <span className="absolute left-[calc(100%+20px)] bg-dark-darker/95 backdrop-blur-heavy text-white px-3.5 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap opacity-0 pointer-events-none transition-all duration-300 border border-white/8 shadow-lg z-[200] group-hover:opacity-100 group-hover:left-[calc(100%+16px)]">
                Settings
              </span>
            )}
          </NavLink>
        </nav>
      </aside>

      {/* Mobile Sidebar */}
      <aside className="md:hidden w-full bg-dark-card/95 backdrop-blur-heavy border-b border-white/8 px-6 py-6">
        <div className="flex items-center gap-4 pb-6 border-b border-white/8">
          <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center font-extrabold text-white shadow-primary relative overflow-hidden logo-shine">
            <span className="relative z-10 text-2xl">G</span>
          </div>
          <div>
            <h3 className="text-[22px] font-bold bg-gradient-text bg-clip-text text-transparent mb-0.5 tracking-tight">
              GigFlow
            </h3>
            <p className="text-[13px] text-white/50 font-normal">Dashboard</p>
          </div>
        </div>

        <nav className="flex overflow-x-auto gap-3 pt-3 pb-2">
          <NavLink
            to="/gigs"
            className={({ isActive }) =>
              `whitespace-nowrap px-5 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-primary/15 text-white"
                  : "text-white/70 hover:bg-primary/10 hover:text-white"
              }`
            }
          >
            Gigs
          </NavLink>

          <NavLink
            to="/create-gig"
            className={({ isActive }) =>
              `whitespace-nowrap px-5 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-primary/15 text-white"
                  : "text-white/70 hover:bg-primary/10 hover:text-white"
              }`
            }
          >
            Create Gig
          </NavLink>

          <NavLink
            to="/applications"
            className={({ isActive }) =>
              `whitespace-nowrap px-5 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-primary/15 text-white"
                  : "text-white/70 hover:bg-primary/10 hover:text-white"
              }`
            }
          >
            Applications
          </NavLink>

          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `whitespace-nowrap px-5 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-primary/15 text-white"
                  : "text-white/70 hover:bg-primary/10 hover:text-white"
              }`
            }
          >
            Settings
          </NavLink>
        </nav>
      </aside>

      {/* Main Content */}
      <main
        className={`min-h-screen p-5 md:p-8 box-border relative z-10 transition-all duration-300 ${
          isCollapsed ? "md:ml-20" : "md:ml-[280px]"
        }`}
      >
        <Outlet />
      </main>
    </div>
  );
}
