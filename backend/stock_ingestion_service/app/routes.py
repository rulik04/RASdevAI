import json
from fastapi import APIRouter, Query, HTTPException
from .services import (
    fetch_stock_data_from_alpha,
    get_cached_stock_data,
    cache_stock_data,
    send_stock_data_to_stream,
)
from .redis_client import redis_client

router = APIRouter()

@router.get("/stocks")
async def get_stock_data(
    option: str = Query(..., description="Stock option (e.g., 'intraday', 'daily')"),
    symbol: str = Query(..., description="Stock symbol (e.g., MSFT)"),
    interval: str = Query(None, description="Data interval (e.g., '5min' for intraday or empty for daily)")
):
    """
    Retrieve stock data for a given symbol and interval.
    Workflow:
      1. Check Redis cache.
      2. If cached, return immediately.
      3. Otherwise, fetch from Alpha Vantage, cache the data, send to Kafka, and return the data.
    """
    cache_key = f"stock:{symbol}"
    if interval:
        cache_key += f":{interval}"
    
    data = await get_cached_stock_data(cache_key)
    if data:
        source = "cache"
        print(f"Retrieved {symbol} data from cache")
    else:
        data = await fetch_stock_data_from_alpha(option, symbol, interval)
        await cache_stock_data(cache_key, data)
        await send_stock_data_to_stream(symbol, data, interval)
        source = "alpha_vantage"
        print(f"Fetched {symbol} data from Alpha Vantage")
    
    return {"source": source, "data": data}

@router.get("/predictions")
async def get_prediction(symbol: str = Query(..., description="Stock symbol to retrieve prediction")):
    """
    Retrieve prediction data for a given symbol from Redis.
    """
    key = f"prediction:{symbol}"
    cached = await redis_client.get(key)
    if cached:
        return {"data": json.loads(cached)}
    else:
        raise HTTPException(status_code=404, detail="No prediction found for the given symbol.")

@router.post("/stocks/refresh")
async def refresh_stock_data(
    symbol: str = Query(..., description="Stock symbol"),
    interval: str = Query(None, description="Data interval (e.g., '5min')")
):
    """
    Force a refresh of stock data from Alpha Vantage, bypassing the cache.
    """
    cache_key = f"stock:{symbol}"
    if interval:
        cache_key += f":{interval}"
    
    data = await fetch_stock_data_from_alpha(symbol, interval)
    await cache_stock_data(cache_key, data)
    await send_stock_data_to_stream(symbol, data, interval)
    return {"source": "alpha_vantage", "data": data}
