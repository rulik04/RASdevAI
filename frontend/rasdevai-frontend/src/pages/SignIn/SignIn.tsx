import React from "react";
import { Form, Input, Button, Typography } from "antd";
import { useAppDispatch, useAppSelector } from "../../states/hooks";
import { loginAsync } from "../../states/authSlice";
import { useNavigate } from "react-router-dom";
import styles from "./SignIn.module.scss";
import { GoogleOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const SignIn: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const authStatus = useAppSelector((state) => state.auth.status);

    const onFinish = async (values: any) => {
        try {
            const resultAction = await dispatch(loginAsync(values));
            if (loginAsync.fulfilled.match(resultAction)) {
                navigate("/");
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className={styles["auth-container"]}>
            {/* <header>
                <div className={styles["brand"]}>RASdevAI</div>
            </header> */}
            <div className={styles["auth-content"]}>
                <div className={styles["left-section"]}>
                    <Title level={1} className={styles["title"]}>
                        Sign in to
                    </Title>
                    <Text className={styles["subtitle"]}>
                        receive accurate prediction
                    </Text>
                    <div className={styles["register-text"]}>
                        If you don’t have an account,
                        <span className={styles["register-link"]}>
                            {" "}
                            Register here!
                        </span>
                    </div>
                    <img
                        src="./src/assets/images/Saly-14.svg"
                        alt="Illustration"
                        className={styles["illustration"]}
                    />
                </div>

                <div className={styles["right-section"]}>
                    <Title level={3}>Sign in</Title>
                    <Form
                        name="sign_in"
                        onFinish={onFinish}
                        layout="vertical"
                        className={styles["form"]}
                    >
                        <Form.Item
                            name="email"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input your email!",
                                },
                            ]}
                        >
                            <Input
                                placeholder="Enter email or user name"
                                className={styles["input-field"]}
                            />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input your password!",
                                },
                            ]}
                        >
                            <Input.Password
                                placeholder="Password"
                                className={styles["input-field"]}
                            />
                        </Form.Item>
                        <Text className={styles["forgot-password"]}>
                            Forgot password?
                        </Text>
                        <Form.Item>
                            <Button
                                htmlType="submit"
                                loading={authStatus === "loading"}
                                block
                                className={styles["login-button"]}
                            >
                                Login
                            </Button>
                        </Form.Item>
                    </Form>
                    <Text className={styles["or-text"]}>or continue with</Text>
                    <div className={styles["social-icons"]}>
                        <GoogleOutlined
                            className={styles["icon"]}
                            onClick={() => {
                                console.log("Google button clicked");
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignIn;
