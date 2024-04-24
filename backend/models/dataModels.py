
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

class Amount(BaseModel):
    amount_dollars: int
    amount_cents: int

class Users(Document):
    username: str
    password: str
    # default to current time
    created_at: datetime = Field(default_factory=datetime.utcnow)
    blocked_user_ids: list[str]
    user_type: UserType
    

class Loans(Document):
    user_id: PydanticObjectId 
    other_user_id: PydanticObjectId
    # default to current time
    created_at: datetime = Field(default_factory=datetime.utcnow)
    original_amount: Amount
    current_amount: Amount
    description: str
    accepted: bool
    status: LoanType = LoanType.OPEN
    
class PaymentPlan(BaseModel):
    start_date: datetime
    end_date: datetime
    frequency_days: int
    amount: Amount
    

# This is where you would store loan payments and regular transactions
class Payments(Document):
    user: PydanticObjectId
    other_user_id: Optional[PydanticObjectId]
    loan: Optional[Loans]
    created_at: datetime = Field(default_factory=datetime.utcnow)
    amount: Amount
    description: str
    # payment plan this payment is apart of ig?
    payment_plan: Optional[PaymentPlan]
    

class BudgetCategory(BaseModel):
    category: str
    percent: int
    
class Budgets(Document):
    user: PydanticObjectId
    total_amount: Amount
    goal_percents: list[BudgetCategory]
    actual_percents: list[BudgetCategory]
    start_date: datetime
    end_date: datetime
    

### END OF DATABASE MODELS


### AUTH

class TokenResponse(BaseModel):
    access_token: str
    token_type: str



class UserRequest(BaseModel):
    username: str
    password: str
    

    
    

   
    
class TransactionRequest(BaseModel):
    user: PydanticObjectId
    other_user: PydanticObjectId
    amount: Amount
    description: Optional[str]
    # this field can likely be deleted later once db is set up
    outgoing: bool
    

# adds extra stuff that would only be added in mongo
class Transaction(TransactionRequest):
    _id: str
    created_at: datetime