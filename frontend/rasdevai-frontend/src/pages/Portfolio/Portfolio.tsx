import React from "react";
import MainLayout from "../../layouts/MainLayout/MainLayout";
import { Typography } from "antd";

const { Title } = Typography;

const Portfolio: React.FC = () => {
    return (
        <MainLayout>
            <Title level={2}>Portfolio</Title>
            <p>Portfolio page content goes here.</p>
        </MainLayout>
    );
};

export default Portfolio;
