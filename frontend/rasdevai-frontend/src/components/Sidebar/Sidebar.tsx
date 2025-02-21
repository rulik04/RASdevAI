import React from "react";
import { Menu, Layout } from "antd";
import {
    DashboardOutlined,
    PieChartOutlined,
    StockOutlined,
    ReadOutlined,
    VideoCameraOutlined,
    LogoutOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import "./Sidebar.scss";

const { Sider } = Layout;

const Sidebar: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        {
            key: "/",
            icon: <DashboardOutlined />,
            label: "Dashboard",
            onClick: () => navigate("/"),
        },
        {
            key: "/portfolio",
            icon: <PieChartOutlined />,
            label: "Portfolio",
            onClick: () => navigate("/portfolio"),
        },
        {
            key: "/market",
            icon: <StockOutlined />,
            label: "Market",
            onClick: () => navigate("/market"),
        },
        {
            key: "/news",
            icon: <ReadOutlined />,
            label: "News",
            onClick: () => navigate("/news"),
        },
        {
            key: "/tutorial",
            icon: <VideoCameraOutlined />,
            label: "Tutorial",
            onClick: () => navigate("/tutorial"),
        },
        {
            key: "logout",
            icon: <LogoutOutlined />,
            label: "Logout",
            onClick: () => navigate("/signin"),
        },
    ];

    return (
        <Sider
            width={300}
            className="sidebar"
            breakpoint="lg"
            style={{
                position: "sticky",
                top: 0,
                height: "100vh",
                overflow: "auto",
                backgroundColor: "white",
                borderRight: "none",
            }}
        >
            <div
                className="logo"
                style={{ color: "#fff", textAlign: "center", padding: "20px" }}
            >
                <span
                    style={{
                        fontWeight: 700,
                        color: "purple",
                        fontSize: "1.5em",
                    }}
                >
                    RAS
                </span>
                <span
                    style={{
                        fontWeight: 700,
                        color: "purple",
                        fontSize: "1.5em",
                    }}
                >
                    dev
                </span>
                <span
                    style={{
                        fontWeight: 700,
                        color: "purple",
                        fontSize: "1.5em",
                    }}
                >
                    AI
                </span>
            </div>
            <Menu
                mode="inline"
                selectedKeys={[location.pathname]}
                items={menuItems.map((item) => ({
                    key: item.key,
                    icon: item.icon,
                    label: item.label,
                    onClick: item.onClick,
                }))}
            />
        </Sider>
    );
};

export default Sidebar;
