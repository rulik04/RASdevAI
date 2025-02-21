import axiosInstance from "./axiosInstance";
import { API_BASE_URL } from "../configs/apiConfig";
import { StockData } from "../types/Stock";

export const fetchStockData = async (
    option: string,
    symbol: string,
    interval?: string
): Promise<StockData> => {
    const response = await axiosInstance.get(`${API_BASE_URL}/stocks`, {
        params: { option, symbol, interval },
    });
    return response.data.data;
};
