
from typing import Optional
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






class UserRequest(BaseModel):
    username: str
    password: str
    

# don't return password
class User(BaseModel):
    id: int
    username: str
    
    
class Amount(BaseModel):
    amount_dollars: int
    amount_cents: int
   
    
class Transaction(BaseModel):
    user: User
    other_user: User
    amount: Amount
    description: Optional[str]
    outgoing: bool
    