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


if __name__ == "__main__":
    uvicorn.run("main:app", reload=True)




