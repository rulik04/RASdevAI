import json
import httpx
from fastapi import HTTPException
from .config import settings
from .redis_client import redis_client

async def fetch_stock_data_from_alpha(option: str, symbol: str, interval: str = None) -> dict:
    """
    Fetches stock data from Alpha Vantage.
    If an intraday interval (like "5min") is specified, uses the TIME_SERIES_INTRADAY function.
    Otherwise, uses TIME_SERIES_DAILY.
    """
    params = {
        "apikey": settings.alpha_vantage_api_key,
        "symbol": symbol,
        # "outputsize": "full"
    }

    if option == "intraday":
        params["function"] = "TIME_SERIES_INTRADAY"
        params["interval"] = interval
    elif option == "daily":
        params["function"] = "TIME_SERIES_DAILY"
    elif option == "weekly":
        params["function"] = "TIME_SERIES_WEEKLY"
    elif option == "monthly":
        params["function"] = "TIME_SERIES_MONTHLY"
    else:
        raise HTTPException(status_code=400, detail="Invalid option. Valid options are 'intraday', 'daily', 'weekly', 'monthly'")
    
    async with httpx.AsyncClient() as client:
        response = await client.get(settings.alpha_vantage_base_url, params=params)
        if response.status_code != 200:
            raise HTTPException(status_code=500, detail="Error fetching data from Alpha Vantage")
        data = response.json()
        if "Error Message" in data or "Note" in data:
            error_detail = data.get("Error Message") or data.get("Note")
            raise HTTPException(status_code=500, detail=f"Alpha Vantage API error: {error_detail}")
        return data

async def get_cached_stock_data(cache_key: str) -> dict:
    """Retrieve stock data from Redis cache."""
    cached = await redis_client.get(cache_key)
    if cached:
        return json.loads(cached)
    return None

async def cache_stock_data(cache_key: str, data: dict):
    """Cache stock data in Redis with a TTL."""
    await redis_client.set(cache_key, json.dumps(data), ex=settings.cache_ttl)

async def send_stock_data_to_stream(symbol: str, data: dict, interval: str):
    """
    Publish stock data to a Redis stream.
    The message contains the symbol, the JSON-encoded data, and the interval.
    """
    message = {
        "symbol": symbol,
        "data": json.dumps(data),
        "interval": interval or ""
    }
    await redis_client.xadd(settings.redis_stock_stream, message)