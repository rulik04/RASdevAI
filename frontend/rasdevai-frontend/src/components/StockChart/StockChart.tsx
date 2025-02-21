import React from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

interface StockChartProps {
    data: { date: string; close: number }[];
    timeframe: string;
}

const StockChart: React.FC<StockChartProps> = ({ data, timeframe }) => {
    const getFilteredData = () => {
        if (!data || data.length === 0) return [];

        const latestDate = new Date(data[data.length - 1].date);
        let cutoff: Date;

        switch (timeframe) {
            case "1D":
                return data.filter((d) => {
                    const dDate = new Date(d.date);
                    return dDate.toDateString() === latestDate.toDateString();
                });
            case "5D":
                cutoff = new Date(latestDate);
                cutoff.setDate(cutoff.getDate() - 5);
                break;
            case "1M":
                cutoff = new Date(latestDate);
                cutoff.setMonth(cutoff.getMonth() - 1);
                break;
            case "6M":
                cutoff = new Date(latestDate);
                cutoff.setMonth(cutoff.getMonth() - 6);
                break;
            case "1Y":
                cutoff = new Date(latestDate);
                cutoff.setFullYear(cutoff.getFullYear() - 1);
                break;
            case "5Y":
                cutoff = new Date(latestDate);
                cutoff.setFullYear(cutoff.getFullYear() - 5);
                break;
            case "MAX":
                return data;
            default:
                return data;
        }
        return data.filter((d) => new Date(d.date) >= cutoff);
    };

    const filteredData = getFilteredData();

    const xAxisTickFormatter = (tick: string) => {
        const date = new Date(tick);
        if (timeframe === "1D") {
            return date.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
            });
        } else if (
            timeframe === "1Y" ||
            timeframe === "5Y" ||
            timeframe === "MAX"
        ) {
            return date.toLocaleDateString();
        } else {
            return date.toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
            });
        }
    };

    return (
        <ResponsiveContainer width="100%" height={400}>
            <LineChart data={filteredData}>
                <XAxis dataKey="date" tickFormatter={xAxisTickFormatter} />
                <YAxis
                    domain={["auto", "auto"]}
                    tickFormatter={(tick) => `$${tick}`}
                    width={60}
                />
                <Tooltip
                    labelFormatter={(label) => new Date(label).toLocaleString()}
                />
                <Line
                    type="monotone"
                    dataKey="close"
                    stroke="#8884d8"
                    strokeWidth={2}
                    dot={false}
                />
            </LineChart>
        </ResponsiveContainer>
    );
};

export default StockChart;
