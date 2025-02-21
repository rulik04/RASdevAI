from dotenv import load_dotenv
import os

dotenv_path = os.path.join(os.path.dirname(__file__), '.env')
load_dotenv(dotenv_path)

from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    alpha_vantage_api_key: str
    alpha_vantage_base_url: str = "https://www.alphavantage.co/query"
    redis_url: str
    cache_ttl: int = 3600  # seconds (1 hour)
    redis_port: int = 6379
    redis_password: str
    redis_stock_stream: str = "stock_data_stream"
    redis_prediction_stream: str = "stock_prediction_stream"

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
