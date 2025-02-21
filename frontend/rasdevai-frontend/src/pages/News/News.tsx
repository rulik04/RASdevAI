import React from "react";
import MainLayout from "../../layouts/MainLayout/MainLayout";
import { Typography } from "antd";

const { Title } = Typography;

const News: React.FC = () => {
    return (
        <MainLayout>
            <Title level={2}>News</Title>
            <p>News page content goes here.</p>
        </MainLayout>
    );
};

export default News;
