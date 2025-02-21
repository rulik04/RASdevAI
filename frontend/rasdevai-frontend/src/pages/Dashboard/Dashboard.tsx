import React, { useEffect, useState } from "react";
import { Typography, Select } from "antd";
import MainLayout from "../../layouts/MainLayout/MainLayout";
import { CustomSlider } from "../../components/Slider/CustomSlider";
import NewsCard from "../../components/NewsCard/NewsCard";
import "./Dashboard.scss";
import { Watchlist } from "../../components/Watchlist/Watchlist";
import StockChart from "../../components/StockChart/StockChart";
const { Title } = Typography;
import { fetchStockAsync } from "../../states/stockSlice";
import { useAppDispatch, useAppSelector } from "../../states/hooks";

const Dashboard: React.FC = () => {
    const dispatch = useAppDispatch();
    const stock = useAppSelector((state) => state.stock);

    const [selectedTimeframe, setSelectedTimeframe] = useState("1D");

    const getStockFetchParams = (timeframe: string) => {
        switch (timeframe) {
            case "1D":
                return { option: "intraday", interval: "5min" };
            case "5D":
                return { option: "intraday", interval: "60min" };
            case "1M":
                return { option: "daily" };
            case "6M":
            case "1Y":
                return { option: "weekly" };
            case "5Y":
            case "MAX":
                return { option: "monthly" };
            default:
                throw new Error(`Unsupported timeframe: ${timeframe}`);
        }
    };

    useEffect(() => {
        const fetchParams = getStockFetchParams(selectedTimeframe);
        dispatch(
            fetchStockAsync({
                symbol: "AAPL",
                ...fetchParams,
            })
        );
    }, [dispatch, selectedTimeframe]);

    const transformData = (rawData: any): any[] => {
        if (!rawData) return [];

        const seriesKeys = [
            "Time Series (5min)",
            "Time Series (60min)",
            "Time Series (Daily)",
            "Weekly Time Series",
            "Monthly Time Series",
        ];
        const timeSeriesKey = seriesKeys.find(
            (key) => rawData[key] !== undefined
        );
        if (!timeSeriesKey) return [];

        const timeSeries = rawData[timeSeriesKey];

        return Object.keys(timeSeries)
            .map((date) => ({
                date,
                close: parseFloat(timeSeries[date]["4. close"]),
            }))
            .sort(
                (a, b) =>
                    new Date(a.date).getTime() - new Date(b.date).getTime()
            );
    };

    const handleTimeframeChange = (value: string) => {
        setSelectedTimeframe(value);
    };

    return (
        <MainLayout>
            <div className="popular-section">
                <Title className="slider-title" level={3}>
                    Popular Stocks
                </Title>
                <CustomSlider />
            </div>
            <div className="top-section">
                <Title className="slider-title" level={3}>
                    Today top moves
                </Title>
                <CustomSlider />
            </div>
            <div className="news-section">
                <Title className="slider-title" level={3}>
                    Latest News
                </Title>
                <NewsCard />
            </div>
            <div className="dashboard-section">
                <div className="chart-section">
                    <div className="chart-header">
                        <Title level={4}>
                            {stock?.data?.name} ({stock?.data?.symbol})
                        </Title>
                        <Select
                            defaultValue="1D"
                            onChange={handleTimeframeChange}
                            className="timeframe-selector"
                        >
                            <Select.Option value="1D">1D</Select.Option>
                            <Select.Option value="5D">5D</Select.Option>
                            <Select.Option value="1M">1M</Select.Option>
                            <Select.Option value="6M">6M</Select.Option>
                            <Select.Option value="1Y">1Y</Select.Option>
                            <Select.Option value="5Y">5Y</Select.Option>
                            <Select.Option value="MAX">MAX</Select.Option>
                        </Select>
                    </div>
                    <StockChart
                        data={transformData(stock.data)}
                        timeframe={selectedTimeframe}
                    />
                </div>
                <div className="watch-section">
                    <Title level={5}>Watchlist</Title>
                    <Watchlist />
                </div>
            </div>
        </MainLayout>
    );
};

export default Dashboard;
