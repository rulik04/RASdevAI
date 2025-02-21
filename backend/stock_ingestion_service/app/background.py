import json
import asyncio
from .config import settings
from .redis_client import redis_client

async def consume_predictions():
    """
    Consume prediction messages from the Redis stream and store the latest prediction
    per symbol in Redis. Each message is expected to include a 'symbol' and 'prediction' field.
    After processing, the message is deleted from the stream.
    """
    stream_key = settings.redis_prediction_stream
    last_id = "0-0"
    while True:
        try:
            results = await redis_client.xread({stream_key: last_id}, block=5000, count=10)
            if results:
                for stream_name, messages in results:
                    for message_id, message in messages:
                        last_id = message_id
                        symbol = message.get("symbol")
                        prediction_data = message.get("prediction")
                        if symbol and prediction_data:
                            await redis_client.set(f"prediction:{symbol}", prediction_data, ex=3600)
                            await redis_client.xdel(stream_key, message_id)
                            print(f"Stored prediction for {symbol}")
        except Exception as e:
            print(f"Error in consume_predictions: {e}")
        await asyncio.sleep(1)
