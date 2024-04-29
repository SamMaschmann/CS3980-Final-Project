from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from auth.hash import HashPassword
from auth.jwt import create_access_token, verify_access_token
from auth.auth import get_user
from database.db import Database
from models.dataModels import TokenResponse, UserRequest, UserResponse, Users
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
    

# need this for it to behave
class Token(BaseModel):
    token: str
    
@user_router.post("/check_token")
async def check_token(token: Token):
    return verify_access_token(token.token)
    
@user_router.get("/users", response_model=UserResponse)
async def get_users() -> list[Users]:
    # not protected because anyone can see all users 
    users = await Users.find().to_list()
    
    return users

# get the usernames of a user's friends
@user_router.get("/users/friends", response_model=UserResponse)
async def get_friends(user: Users = Depends(get_user)) -> list[str]:
    return user.friends

@user_router.post("/users/friends")
async def add_friend(friend_username: str, user: Users = Depends(get_user)) -> dict:
    # check to see if user being added exists 
    exists = await Users.find_one(Users.username == friend_username)
    
    if not exists:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User with this username does not exist.",
        )
        
    # check to see if user is already in friend's list 
    if friend_username not in user.friends:
        user.friends.append(friend_username)
        user_database.update(user.id, user)
    else:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="User with this username is already a friend"
        )
        
    return {"message": f"Friend with username {friend_username} successfully added"}
    

@user_router.delete("/users/friends")
async def remove_friend(friend_username: str, user: Users = Depends(get_user)) -> dict:
    # check to see if user being added exists 
    exists = await Users.find_one(Users.username == friend_username)
    
    if not exists:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User with this username does not exist.",
        )
        
    # check to see if user is already in friend's list 
    if friend_username in user.friends:
        idx = user.friends.index(friend_username)
        del user.friends[idx]
        user_database.update(user.id, user)
    else:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="User with this username is not a friend"
        )
        
    return {"message": f"Friend with username {friend_username} successfully deleted"}




