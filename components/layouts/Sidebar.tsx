"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import {
    LayoutDashboard,
    BookOpen,
    Map,
    Bot,
    ShoppingBag,
    Settings,
    LogOut,
    GraduationCap,
} from "lucide-react";

const NAV_ITEMS = [
    { label: "Dashboard", href: "/subjects", icon: LayoutDashboard },
    { label: "Courses", href: "/subjects", icon: BookOpen },
    { label: "Learning Roadmap", href: "/subjects", icon: Map },
    { label: "AI Assistant", href: "/subjects", icon: Bot },
    { label: "Purchases", href: "/subjects", icon: ShoppingBag },
    { label: "Settings", href: "/profile", icon: Settings },
];

export default function Sidebar() {
    const router = useRouter();
    const pathname = usePathname();
    const { logout } = useAuthStore();

    const handleLogout = () => {
        logout();
        router.push("/auth/login");
    };

    return (
        <aside className="ds-sidebar dashboard-sidebar">
            {/* Logo */}
            <div className="ds-sidebar-logo">
                <div className="ds-sidebar-logo-icon">
                    <GraduationCap size={20} />
                </div>
                <div className="ds-sidebar-logo-text">
                    Path<span>To</span>Pro
                </div>
            </div>

            {/* Navigation */}
            <nav className="ds-sidebar-nav">
                <div className="ds-sidebar-section">Menu</div>
                {NAV_ITEMS.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href && item.label === "Dashboard";

                    return (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={`ds-sidebar-item${isActive ? " active" : ""}`}
                        >
                            <Icon className="ds-sidebar-icon" size={20} />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer — Logout */}
            <div className="ds-sidebar-footer">
                <button className="ds-sidebar-logout" onClick={handleLogout}>
                    <LogOut className="ds-sidebar-icon" size={20} />
                    Logout
                </button>
            </div>
        </aside>
    );
}
