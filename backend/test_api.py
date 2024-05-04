from contextlib import asynccontextmanager
from functools import lru_cache
from fastapi import FastAPI
from starlette.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from database.db import Settings
# from routes.debts import debt_router
from routes.loans import loan_router
from routes.users import user_router
from routes.payments import payments_router
from routes.budgets import budget_router

import logging
import logging_config
logging_config.setup_logging()
logger = logging.getLogger(__name__)

@lru_cache
def get_settings():
    return Settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    # on startup event
    # logger.info("Application starts up...")
    await get_settings().initialize_database()
    yield
    # on shutdown event
    
app = FastAPI(title="Richify", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# app.include_router(debt_router)
app.include_router(loan_router)
app.include_router(user_router)
app.include_router(payments_router)
app.include_router(budget_router)


# TESTING 
from fastapi.testclient import TestClient
import json 

client = TestClient(app)

def test_get_budgets():
    response = client.post("/signin",
        json={"username":"UNIT_TEST_USER_DONT_TOUCH","password":"UNIT_TEST_USER_DONT_TOUCH"})
    print(response)
    # assert response.status_code == 200
    # assert response.json() == {"message": "GET budgets"}

test_get_budgets() # TODO: Cannot get this to return a valid response