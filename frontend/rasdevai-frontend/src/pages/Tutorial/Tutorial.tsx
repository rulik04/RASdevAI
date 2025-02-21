import React from "react";
import MainLayout from "../../layouts/MainLayout/MainLayout";
import { Typography } from "antd";

const { Title } = Typography;

const Tutorial: React.FC = () => {
    return (
        <MainLayout>
            <Title level={2}>Tutorial</Title>
            <p>Tutorial page content goes here.</p>
        </MainLayout>
    );
};

export default Tutorial;
