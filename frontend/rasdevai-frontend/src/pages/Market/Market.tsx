import React from "react";
import MainLayout from "../../layouts/MainLayout/MainLayout";
import { Typography } from "antd";

const { Title } = Typography;

const Market: React.FC = () => {
    return (
        <MainLayout>
            <Title level={2}>Market</Title>
            <p>Market page content goes here.</p>
        </MainLayout>
    );
};

export default Market;
