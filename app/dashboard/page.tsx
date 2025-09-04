"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useState, useEffect } from "react";
import ThemeToggle from "@/components/ThemeToggle";
import { 
  IconDashboard, 
  IconUsers, 
  IconMenu2, 
  IconLogout, 
  IconVideo, 
  IconCash, 
  IconSettings,
  IconPackage
} from "@tabler/icons-react";

import AdminContent from "./components/AdminContents";
import VideoManagement from "./components/VideoManagement";
import PaymentManagement from "./components/PaymentManagement";
import AdminPaymentSettings from "./components/AdminPaymentSettings";
import MyVideos from "./components/MyVideos";
import LogoutButton from "@/components/LogoutButton";
import StudentContent from "./components/StudentContents";

// ✅ NEW imports
import KitManagement from "./components/AdminKitManagement";
import MyKits from "./components/StudentKits";
import {Spinner }from "@/components/Spinner"; // ← your spinner component

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [windowWidth, setWindowWidth] = useState(1024);
  const [activeView, setActiveView] = useState("dashboard");

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setSidebarOpen(windowWidth >= 768);
  }, [windowWidth]);

  // Show your spinner while session is loading
  if (status === "loading") {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-background">
        <Spinner />
      </div>
    );
  }

  if (!session) redirect("/login");

  const user = session.user;

  // Sidebar items depend on role
  const sidebarItems = user.role === "ADMIN" 
    ? [
        { title: "Dashboard", key: "dashboard", icon: IconDashboard },
        { title: "Videos", key: "videos", icon: IconVideo },
        { title: "Kits", key: "kits", icon: IconPackage },
        { title: "Payments", key: "payments", icon: IconCash },
        { title: "Payment Settings", key: "paymentSettings", icon: IconSettings },
      ]
    : [
        { title: "My Dashboard", key: "dashboard", icon: IconDashboard },
        { title: "My Videos", key: "myVideos", icon: IconVideo },
        { title: "My Kits", key: "myKits", icon: IconPackage },
      ];

  // Render content based on active view
  const renderContent = () => {
    if (user.role === "ADMIN") {
      switch (activeView) {
        case "dashboard": return <AdminContent />;
        case "videos": return <VideoManagement />;
        case "kits": return <KitManagement />;
        case "payments": return <PaymentManagement />;
        case "paymentSettings": return <AdminPaymentSettings />;
        default: return <p>Not Found</p>;
      }
    } else {
      switch (activeView) {
        case "dashboard": return <StudentContent />;
        case "myVideos": return <MyVideos />;
        case "myKits": return <MyKits />;
        default: return <p>Not Found</p>;
      }
    }
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-screen bg-background border-r border-border transition-all duration-300 flex flex-col ${sidebarOpen ? "w-64" : "w-16"}`}>
        <div className="flex items-center justify-between p-4 border-b border-border">
          {sidebarOpen && <h2 className="text-lg font-bold">AsamFX</h2>}
          <button className="p-1 rounded hover:bg-accent/10" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <IconMenu2 size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-2 space-y-2">
          {sidebarItems.map(item => (
            <button
              key={item.key}
              className={`flex items-center gap-2 p-2 rounded w-full hover:bg-accent/10 ${activeView === item.key ? "bg-accent/20 font-semibold" : ""}`}
              onClick={() => setActiveView(item.key)}
            >
              <item.icon size={20} />
              {sidebarOpen && item.title}
            </button>
          ))}
        </nav>

        {/* Profile / Logout */}
        <div className="p-4 border-t border-border flex items-center gap-2">
          {sidebarOpen && windowWidth >= 768 ? (
            <>
              {user?.image ? (
                <img
                  src={user.image}
                  alt="avatar"
                  className="w-8 h-8 rounded-full cursor-pointer hover:ring-2 hover:ring-accent"
                  onClick={() => window.location.href = "/user/settings"}
                  onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/avatar-placeholder.png"; }}
                />
              ) : (
                <div
                  className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-white font-semibold text-sm cursor-pointer hover:ring-2 hover:ring-accent"
                  onClick={() => window.location.href = "/user/settings"}
                >
                  {user?.name.split(" ").map(n => n[0]).join("").toUpperCase()}
                </div>
              )}
              <span className="flex-1 text-sm">{user?.name}</span>
              <LogoutButton />
            </>
          ) : (
            <LogoutButton />
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 p-4 md:p-6 overflow-y-auto h-screen transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-16"}`}>
        <header className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Welcome, {user?.name}!</h1>
            <span className="text-gray-700">Role: {user?.role}</span>
          </div>
          <ThemeToggle />
        </header>

        {renderContent()}
      </main>
    </div>
  );
}
