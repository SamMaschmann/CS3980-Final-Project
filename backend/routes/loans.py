import base64
from typing import Any
from beanie import PydanticObjectId
from bson import BSON
from fastapi import APIRouter, Depends, HTTPException, File, UploadFile, Query
from fastapi.responses import FileResponse, JSONResponse

from auth.hash import HashPassword
from auth.jwt import create_access_token, verify_access_token
from auth.auth import get_user
from database.db import Database
from models.dataModels import LoanRequest, LoanUpdate, Loans, Users
from fastapi import status
import os

import logging
logger = logging.getLogger(__name__)

loan_router = APIRouter(tags=["Loans"])

loan_database = Database(Loans) 

hash_password = HashPassword()

UPLOAD_DIR = "uploaded_files"
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

@loan_router.get("/loans", response_model=list[Loans])
async def get_all_loans(user: Users = Depends(get_user)) -> list[Loans]:
    logger.info(user)
    logger.info("[get /loans] Fetching loans for user " + user.username)
    
    loans = await loan_database.get_all(user.username)
    
    return loans

@loan_router.get("/loans/{id}/files")
async def fetch_loan_file(id: PydanticObjectId, user: Users = Depends(get_user)):
    loan = await Loans.find_one(Loans.id == id)
    # fetch documen
    if loan.loan_document:
        file_path = os.path.join(UPLOAD_DIR, loan.loan_document)
        headers = {"Access-Control-Expose-Headers": "*"}
        return FileResponse(file_path, filename=loan.loan_document, headers=headers)

@loan_router.delete("/loans/{id}/files")
async def delete_file(id: PydanticObjectId, user: Users = Depends(get_user)):
    loan = await Loans.find_one(Loans.id == id)
    
    # TODO add logging and auth
    loan.loan_document = None
    
    await loan.save()
    
    logger.info("Loan document deleted successfully")
    
    return {"message": "Loan document successfully deleted"}
    

@loan_router.post("/loans")
async def create_loan(body: LoanRequest, user: Users = Depends(get_user)) -> Loans:
    logger.info("[post /loans] Adding loan for user " + user.username)
    body.user = user.username
    
    new_loan = Loans(
        user=user.username,
        other_user=body.other_user,
        current_amount=body.amount,
        original_amount=body.amount,
        accepted=False,
        description=body.description,
        loan_document=None
    )
    id = await loan_database.save(new_loan)
    
    
    return new_loan

@loan_router.post("/loans/{id}/upload")
async def upload_loan_document(
    id: PydanticObjectId,
    file: UploadFile = File(...),
    user: Users = Depends(get_user)
):
    # Handle file upload
    # Example: Save the file to a server directory
    with open(os.path.join(UPLOAD_DIR, file.filename), "wb") as f:
        f.write(await file.read())
    
    
    # upload to mongo using id 
    loan = await Loans.find_one(Loans.id == id)
    loan.loan_document = file.filename
    
    await loan.save()
    

    return {"message": "File uploaded successfully"}

@loan_router.put("/loans/{id}")
async def update_loan(id: PydanticObjectId, body: LoanUpdate, user: Users = Depends(get_user)) -> Loans:
    logger.info(f"User {user} is updating loan id = {id}")
    
    loan = await Loans.find(Loans.id == id)
    
    if not loan:
        logger.warning(f"Loan with id = {id} does not exist")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Loan with id = {id} does not exist"
        )
    
    if loan.user != user.username:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Loan with id = {id} does not exist"
        )
    
    updated_loan = await loan_database.update(id, body)
    
    logger.info(f"Loan with id = {id} was updated")
    
    return updated_loan
