import asyncio
import logging
from fastapi import FastAPI
from app.routes import router as stock_router
from app.background import consume_predictions
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

dotenv_path = os.path.join(os.path.dirname(__file__), '.env')
load_dotenv(dotenv_path)

app = FastAPI(title="Stock Ingestion Service")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(stock_router)

@app.on_event("startup")
async def startup_event():
    asyncio.create_task(consume_predictions())

@app.on_event("shutdown")
async def shutdown_event():
    pass
    
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8002, reload=True)
