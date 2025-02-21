import React from "react";
import { Layout, Avatar, Input, Badge } from "antd";
import { UserOutlined, SearchOutlined, BellOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../states/hooks";
import Sidebar from "../../components/Sidebar/Sidebar";
import "./MainLayout.scss";

const { Header, Content } = Layout;

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const navigate = useNavigate();
    const user = useAppSelector((state) => state.auth.user);

    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Sidebar />
            <Layout className="site-layout">
                <Header
                    style={{
                        padding: 0,
                        backgroundColor: "white",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        paddingLeft: "20px",
                        paddingRight: "20px",
                    }}
                >
                    <div style={{ fontSize: "1.2em", color: "black" }}>
                        <span>Hello, {user?.username}</span>
                    </div>

                    <div style={{ display: "flex", alignItems: "center" }}>
                        <Input
                            placeholder="Search for stocks and more"
                            prefix={<SearchOutlined />}
                            style={{ width: 300, marginRight: 20 }}
                            className="search-input"
                            variant="borderless"
                            allowClear={true}
                        />

                        <Badge count={5} style={{ marginRight: 30 }}>
                            <BellOutlined
                                style={{ fontSize: 20, marginRight: 30 }}
                            />
                        </Badge>

                        <Avatar
                            size="large"
                            icon={<UserOutlined />}
                            style={{ cursor: "pointer" }}
                            onClick={() => navigate("/profile")}
                        />
                    </div>
                </Header>
                <Content style={{ margin: "16px" }}>{children}</Content>
            </Layout>
        </Layout>
    );
};

export default MainLayout;
