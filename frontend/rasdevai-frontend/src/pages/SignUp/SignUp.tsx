import React from "react";
import { Form, Input, Button, Typography, Layout } from "antd";
import { useAppDispatch, useAppSelector } from "../../states/hooks";
import { signUpAsync } from "../../states/authSlice";
import { useNavigate } from "react-router-dom";
import "../Auth.scss";

const { Title } = Typography;
const { Content } = Layout;

const SignUp: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const authStatus = useAppSelector((state) => state.auth.status);

    const onFinish = async (values: any) => {
        try {
            const resultAction = await dispatch(signUpAsync(values));
            if (signUpAsync.fulfilled.match(resultAction)) {
                navigate("/");
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Layout className="auth-layout">
            <Content className="auth-content">
                <Title level={2}>Sign Up</Title>
                <Form name="sign_up" onFinish={onFinish} layout="vertical">
                    <Form.Item
                        name="username"
                        label="Username"
                        rules={[
                            {
                                required: true,
                                message: "Please input your username!",
                            },
                        ]}
                    >
                        <Input placeholder="Username" />
                    </Form.Item>
                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                            {
                                required: true,
                                message: "Please input your email!",
                            },
                        ]}
                    >
                        <Input placeholder="Email" />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        label="Password"
                        rules={[
                            {
                                required: true,
                                message: "Please input your password!",
                            },
                        ]}
                    >
                        <Input.Password placeholder="Password" />
                    </Form.Item>
                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={authStatus === "loading"}
                            block
                        >
                            Sign Up
                        </Button>
                    </Form.Item>
                </Form>
            </Content>
        </Layout>
    );
};

export default SignUp;
