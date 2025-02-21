import { Card, Typography } from "antd";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import "./StockCard.scss";

const { Text } = Typography;

export interface StockCardProps {
    logoUrl: string;
    companyName: string;
    ticker: string;
    shareChange: number;
    currentPrice: number;
    miniChartData: { date: string; value: number }[];
}

export const StockCard = ({
    logoUrl,
    companyName,
    ticker,
    shareChange,
    currentPrice,
    miniChartData,
}: StockCardProps) => {
    const changeColor = shareChange >= 0 ? "green" : "red";
    const formattedChange =
        shareChange >= 0 ? `+${shareChange}` : `${shareChange}`;
    return (
        <Card className="stock-card" hoverable>
            <div className="stock-card-header">
                <div className="stock-card-logo">
                    <img src={logoUrl} alt={`${companyName} logo`} />
                    <span>{companyName}</span>
                </div>
                <div className="stock-card-ticker">
                    <div>{ticker}</div>
                    <div style={{ color: changeColor }}>{formattedChange}</div>
                </div>
            </div>
            <div className="stock-card-body">
                <div className="stock-card-info">
                    <Text strong>Current Value</Text>
                    <div>${currentPrice.toFixed(2)}</div>
                </div>
                <div className="stock-card-chart">
                    <ResponsiveContainer width="100%" height={50}>
                        <LineChart data={miniChartData}>
                            <Line
                                type="monotone"
                                dataKey="value"
                                stroke="#8884d8"
                                dot={false}
                                strokeWidth={2}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </Card>
    );
};
