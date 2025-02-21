import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { StockCard } from "../StockCard/StockCard";
import Slider from "react-slick";
import popularStocks from "./popularStocks.json";
import "./CustomSlider.module.scss";
import styles from "./CustomSlider.module.scss";
function SampleNextArrow(props) {
    const { className, style, onClick } = props;
    return (
        <div
            className={`${className} ${styles["custom-arrow"]} `}
            style={{ ...style }}
            onClick={onClick}
        >
            <div className={styles["next-arrow"]}>
                <svg
                    width="24"
                    height="25"
                    viewBox="0 0 24 25"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M10 5.5L17 12.5L10 19.5"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </div>
        </div>
    );
}

function SamplePrevArrow(props) {
    const { className, style, onClick } = props;
    return (
        <div
            className={`${className} ${styles["custom-arrow"]} `}
            style={{ ...style }}
            onClick={onClick}
        >
            <div className={styles["prev-arrow"]}>
                <svg
                    width="24"
                    height="25"
                    viewBox="0 0 24 25"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M14 19.5L7 12.5L14 5.5"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </div>
        </div>
    );
}

const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 600,
    slidesToShow: 4,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: "25px",

    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
};

export const CustomSlider = () => {
    return (
        <div className={styles["custom-slider"]}>
            <Slider {...sliderSettings}>
                {popularStocks.map((stock, index) => (
                    <div key={index}>
                        <StockCard {...stock} />
                    </div>
                ))}
            </Slider>
        </div>
    );
};
