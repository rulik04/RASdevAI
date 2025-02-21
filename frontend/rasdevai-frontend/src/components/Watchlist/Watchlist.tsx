import styles from "./Watchlist.module.scss";

interface WatchlistProps {
    stockName: string;
    ticker: string;
    currentPrice: number;
    shareChange: number;
    imageUrl: string;
}

const watchlistData: WatchlistProps[] = [
    {
        stockName: "Tesla Inc.",
        ticker: "TSLA",
        currentPrice: 700.0,
        shareChange: 20.0,
        imageUrl:
            "https://storage.googleapis.com/iexcloud-hl37opg/api/logos/TSLA.png",
    },
    {
        stockName: "Apple Inc.",
        ticker: "AAPL",
        currentPrice: 120.0,
        shareChange: -5.0,
        imageUrl:
            "https://storage.googleapis.com/iexcloud-hl37opg/api/logos/AAPL.png",
    },
    {
        stockName: "Amazon.com Inc.",
        ticker: "AMZN",
        currentPrice: 3200.0,
        shareChange: 50.0,
        imageUrl:
            "https://storage.googleapis.com/iexcloud-hl37opg/api/logos/AMZN.png",
    },
];

export const Watchlist = () => {
    return (
        <div>
            {watchlistData.map((stock, index) => (
                <div key={index} className={styles.watchlistItem}>
                    <div className={styles.stockCardHeader}>
                        <img
                            src={stock.imageUrl}
                            alt={stock.ticker}
                            className={styles.watchlistLogo}
                        />

                        <div className={styles.stockCardBody}>
                            <div className={styles.watchlistName}>
                                {stock.stockName}
                            </div>
                            <div className={styles.watchlistTicker}>
                                {stock.ticker}
                            </div>
                        </div>
                    </div>
                    <div className={styles.stockCardFooter}>
                        <div className={styles.watchlistPrice}>
                            ${stock.currentPrice.toFixed(2)}
                        </div>
                        <div
                            className={styles.watchlistChange}
                            style={{
                                color: stock.shareChange >= 0 ? "green" : "red",
                            }}
                        >
                            {stock.shareChange >= 0 ? "+" : ""}
                            {stock.shareChange}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
