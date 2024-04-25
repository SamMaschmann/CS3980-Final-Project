
from datetime import datetime
from enum import Enum
from typing import Optional
from beanie import Document, PydanticObjectId
from pydantic import BaseModel, Field



# class Debt(BaseModel):
#     id: int
#     person: str
#     amount: float
#     reason: str


# class DebtRequest(BaseModel):
#     person: str
#     amount: float
#     reason: str



### DATABASE MODELS PLEASE DON"T DELETE

class UserType(str, Enum):
    ADMIN = "ADMIN",
    USER = "USER"
    
class LoanType(str, Enum):
    CLOSED = "CLOSED",
    OPEN = "OPEN"


class Users(Document):
    username: str
    password: str
    # default to current time
    created_at: datetime = Field(default_factory=datetime.utcnow)
    blocked_user_ids: list[str]
    user_type: UserType
    

class Loans(Document):
    user: str
    other_user: Optional[str]
    # default to current time
    created_at: datetime = Field(default_factory=datetime.utcnow)
    original_amount: int
    current_amount: int
    description: str
    accepted: bool
    status: LoanType = LoanType.OPEN
    
class PaymentPlan(BaseModel):
    start_date: datetime
    end_date: datetime
    frequency_days: int
    amount: int
    

# This is where you would store loan payments and regular transactions
class Payments(Document):
    user: str
    other_user: Optional[str]
    loan_id: Optional[PydanticObjectId]
    created_at: datetime = Field(default_factory=datetime.utcnow)
    amount: int
    description: str
    # payment plan this payment is apart of ig?
    payment_plan: Optional[PaymentPlan]

    

class BudgetCategory(BaseModel):
    category: str
    percent: int
    
class Budgets(Document):
    user: str
    total_amount: int
    goal_percents: list[BudgetCategory]
    actual_percents: list[BudgetCategory]
    start_date: datetime
    end_date: datetime
    

### END OF DATABASE MODELS


### AUTH

class TokenResponse(BaseModel):
    access_token: str
    token_type: str


### REQUESTS 

class PaymentRequest(BaseModel):
    other_user: str
    amount: int
    description: Optional[str]
    



class UserRequest(BaseModel):
    username: str
    password: str
    

    
    