import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { fetchStockData } from "../services/stockService";
import { StockData } from "../types/Stock";

interface StockState {
    symbol: string;
    data: StockData | null;
    status: "idle" | "loading" | "failed";
    error: string | null;
}

const initialState: StockState = {
    symbol: "",
    data: null,
    status: "idle",
    error: null,
};

export const fetchStockAsync = createAsyncThunk(
    "stock/fetchStock",
    async (params: { option: string; symbol: string; interval?: string }) => {
        const data = await fetchStockData(
            params.option,
            params.symbol,
            params.interval
        );
        return { symbol: params.symbol, data };
    }
);

const stockSlice = createSlice({
    name: "stock",
    initialState,
    reducers: {
        setSymbol(state, action: PayloadAction<string>) {
            state.symbol = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchStockAsync.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchStockAsync.fulfilled, (state, action) => {
                state.status = "idle";
                state.symbol = action.payload.symbol;
                state.data = action.payload.data;
            })
            .addCase(fetchStockAsync.rejected, (state, action) => {
                state.status = "failed";
                state.error =
                    action.error.message || "Failed to fetch stock data";
            });
    },
});

export const { setSymbol } = stockSlice.actions;
export default stockSlice.reducer;
