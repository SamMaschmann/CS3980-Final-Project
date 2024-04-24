from auth.jwt import verify_access_token
from models.dataModels import Users


async def get_user(token: str):
    user = verify_access_token(token)
    user_found = await Users.find_one(Users.username == user["user"])
    return user_found