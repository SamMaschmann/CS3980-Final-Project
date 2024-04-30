from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from auth.hash import HashPassword
from auth.jwt import create_access_token, verify_access_token
from auth.auth import get_user
from database.db import Database
from models.dataModels import TokenResponse, UserRequest, UserResponse, Users
from fastapi import status

import logging
logger = logging.getLogger(__name__)

user_router = APIRouter(tags=["User"])

user_database = Database(Users)

hash_password = HashPassword()

@user_router.post("/signup")
async def signup_user(user: UserRequest) -> dict:
    
    logger.info("[post /signup] Creating user " + user.username)

    # check if user already exists
    exists = await Users.find_one(Users.username == user.username)
    
    if exists:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="User with username already exists"
        )
        
    # hash password before storing it 
    hashed_password = hash_password.create_hash(user.password)
    
    new_user = Users(username=user.username, password=hashed_password)
    
    await user_database.save(new_user)
    
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
        logger.info("[post /signin] Successfully signed in user " + user.username)
        access_token = create_access_token(exists.username)
        print("GOT HERE") 
        return {"access_token": access_token, "token_type": "Bearer", "username":user.username}
    
    logger.info("[post /signin] Invalid login attempt: " + user.username)
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
    
@user_router.get("/users", response_model=list[str])
async def get_users() -> list[Users]:
    logger.info("[get /users] Fetching all users")
    # not protected because anyone can see all users 
    users = await Users.find().to_list()
    # just return usernames
    users = [x.username for x in users]
    return users

# get the usernames of a user's friends
@user_router.get("/users/friends", )
async def get_friends(user: Users = Depends(get_user)) -> list[str]:
    logger.info("[get /users/friends] Fetching friends of user " + user.username)
    return user.friends


# need this to send data right
class FriendAddRequest(BaseModel):
    friend_username: str

@user_router.post("/users/friends")
async def add_friend(friend_username: FriendAddRequest, user: Users = Depends(get_user)) -> dict:
    # check to see if user being added exists 
    exists = await Users.find_one(Users.username == friend_username.friend_username)
    
    if not exists:
        logger.info(f"[post /users/friends] {user.username} tried to friend a non-existant user")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User with this username does not exist.",
        )
        
    # check to see if user is already in friend's list 
    if friend_username not in user.friends:
        user.friends.append(friend_username)
        user.save()
    else:
        logger.info("[post /users/friends] User with this username is already a friend for " + user.username)
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="User with this username is already a friend"
        )
        
    logger.info("[post /users/friends] Successfully added friend for " + user.username)
    return {"message": f"Friend with username {friend_username} successfully added"}
    

@user_router.delete("/users/friends")
async def remove_friend(friend_username: str, user: Users = Depends(get_user)) -> dict:
    exists = await Users.find_one(Users.username == friend_username)
    
    if not exists:
        logger.info("[delete /users/friends] User with this username is already a friend for " + user.username)
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User with this username does not exist.",
        )
        
    # check to see if user is already in friend's list 
    if friend_username in user.friends:
        idx = user.friends.index(friend_username)
        del user.friends[idx]
        await user.save()
    else:
        logger.info("[delete /users/friends] User with this username is already a friend for " + user.username)
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="User with this username is not a friend"
        )
        
    logger.info("[delete /users/friends] Successfully removed friend for " + user.username)
    return {"message": f"Friend with username {friend_username} successfully deleted"}




