from fastapi import FastAPI
from starlette.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from backend.routes.debts import debt_router
from backend.routes.transactions import transactions_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(debt_router)
app.include_router(transactions_router)


@app.get("/")
async def read_index():
    return FileResponse("./frontend/index.html")


@app.get("/addDebt")
async def read_index():
    return FileResponse("./frontend/addDebt.html")


@app.get("/updateDebt")
async def read_index():
    return FileResponse("./frontend/updateDebt.html")


@app.get("/style.css")
async def read_index():
    return FileResponse("./frontend/style.css")


@app.get("/debts.js")
async def read_index():
    return FileResponse("./frontend/debts.js")

@app.get("/src/main.tsx")
async def read_index():
    return FileResponse("./frontend/src/main.tsx")