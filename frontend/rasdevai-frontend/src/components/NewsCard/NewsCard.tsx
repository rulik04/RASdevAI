import React from "react";
import { Card, Typography } from "antd";
import styles from "./NewsCard.module.scss";

const { Text } = Typography;

interface NewsItem {
    title: string;
    image: string;
    ticker: string;
    change: string;
    source: string;
    time: string;
}

const newsData: NewsItem[] = [
    {
        title: "Facebook’s ‘Failed’ Libra Cryptocurrency Is No Closer to Release",
        image: "https://static.tengrinews.kz/userdata/news/2025/news_562477/thumb_b/photo_502363.jpeg.webp",
        ticker: "META",
        change: "🔼0.26%",
        source: "Bloomberg",
        time: "35m ago",
    },
    {
        title: "The best bullish case ever made for Tesla, according to prominent Tesla bear",
        image: "https://static.tengrinews.kz/userdata/news/2025/news_562477/thumb_b/photo_502363.jpeg.webp",
        ticker: "TSLA",
        change: "🔽0.34%",
        source: "The Atlantic",
        time: "1h ago",
    },
    {
        title: "Apple has soared out of the value realm, but you may still be able to find success on this stock list",
        image: "https://static.tengrinews.kz/userdata/news/2025/news_562477/thumb_b/photo_502363.jpeg.webp",
        ticker: "AAPL",
        change: "🔼0.51%",
        source: "WSJ",
        time: "3h ago",
    },
];

const NewsCard: React.FC = () => {
    return (
        <div className={styles.newsContainer}>
            <div className={styles.newsList}>
                {newsData.map((news, index) => (
                    <Card key={index} className={styles.newsCard}>
                        <div className={styles.newsContent}>
                            <img
                                src={news.image}
                                alt={news.ticker}
                                className={styles.newsImage}
                            />
                            <div className={styles.newsText}>
                                <Text>{news.title}</Text>
                                <div className={styles.newsMeta}>
                                    <Text strong>
                                        {news.ticker} {news.change}
                                    </Text>
                                    <Text>
                                        {news.source} · {news.time}
                                    </Text>
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default NewsCard;
