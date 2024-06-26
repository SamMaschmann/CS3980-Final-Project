
from datetime import datetime
from enum import Enum
from typing import Any, Optional
from beanie import Document, PydanticObjectId
from bson import BSON
from fastapi import File, UploadFile
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

# Users are uniquely identified by their usernames 

class Users(Document):
    username: str
    password: str
    # default to current time
    created_at: datetime = Field(default_factory=datetime.utcnow)
    blocked_users: Optional[list[str]] = []
    user_type: UserType = UserType.USER
    friends: Optional[list[str]] = []
    
    

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
    loan_document: Optional[Any] = File(...)
    
class PaymentPlan(BaseModel):
    start_date: datetime
    end_date: datetime
    frequency_days: int
    amount: int
    


class PaymentState(str, Enum):
    PENDING = "PENDING"
    ACCEPTED = "ACCEPTED"
    DECLINED = "DECLINED"
    
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
    state: PaymentState = PaymentState.PENDING

    

class Expense(BaseModel):
    id: PydanticObjectId = Field(default_factory=PydanticObjectId)
    name: str
    category: str
    amount: int


# "user_id":{"$oid": "5eb7cf5a86d9755df3a6c563"},
# "items":"test"

## We still need this to track the actual goals for the budget
# class BudgetCategory(BaseModel):
#     category: str
#     goal_percent: int
    # actual percent can be calculated elsewhere

 

class Budgets(Document):
    user:  str
    expenses: list[Expense] 

### END OF DATABASE MODELS


### AUTH

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    username: str


### REQUESTS 

class PaymentRequest(BaseModel):
    other_user: str
    amount: int
    description: Optional[str]
    state: Optional[PaymentState] = PaymentState.PENDING
    
class LoanRequest(BaseModel):
    user: str
    other_user: str
    amount: int
    description: str
    


class UserRequest(BaseModel):
    username: str
    password: str
    
    

### RESPONSES

class UserResponse(BaseModel):
    username: str
    user_type: UserType
    

### UPDATES

class LoanUpdate(BaseModel):
    other_user: Optional[str] = None
    original_amount: int
    current_amount: int
    description: str
    accepted: bool
    status: LoanType
    
    
