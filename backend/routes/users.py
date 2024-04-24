from fastapi import APIRouter, HTTPException

from auth.hash import HashPassword
from auth.jwt import create_access_token
from database.db import Database
from models.dataModels import TokenResponse, UserRequest, Users
from fastapi import status


user_router = APIRouter(tags=["User"])

user_database = Database(Users)

hash_password = HashPassword()

@user_router.post("/signup")
async def signup_user(user: Users) -> dict:
    
    # check if user already exists
    exists = await Users.find_one(Users.username == user.username)
    
    if exists:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="User with username already exists"
        )
        
    # hash password before storing it 
    hashed_password = hash_password.create_hash(user.password)
    
    user.password = hashed_password
    
    await user_database.save(user)
    
    return {"message": "User was created"}

@user_router.post("/signin", response_model=TokenResponse)
async def signin_user(user: UserRequest) -> dict:
    # check if user exists 
    exists = await Users.find_one(Users.username == user.username)
    
    if not exists:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User with this username does not exist.",
        )
        
    # check the password 
    if hash_password.verify_hash(user.password, exists.password):
        access_token = create_access_token(exists.username)
        
        return {"access_token": access_token, "token_type": "Bearer"}
    
    # otherwise invalid
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid login"
    )
    


