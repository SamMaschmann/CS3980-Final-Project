from contextlib import asynccontextmanager
from functools import lru_cache
from fastapi import FastAPI
from starlette.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from backend.settings import Settings
from routes.debts import debt_router
from routes.transactions import transactions_router


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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


app.include_router(debt_router)
app.include_router(transactions_router)




