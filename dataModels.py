from pydantic import BaseModel


class Debt(BaseModel):
    id: int
    person: str
    amount: float
    reason: str


class DebtRequest(BaseModel):
    person: str
    amount: float
    reason: str
