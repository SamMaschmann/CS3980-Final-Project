from fastapi import APIRouter, Path, HTTPException, status
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from debtModel import Debt, DebtRequest

debt_router = APIRouter()

debts = []
nextId = 0

