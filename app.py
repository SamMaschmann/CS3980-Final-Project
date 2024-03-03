from fastapi import FastAPI
from starlette.responses import FileResponse


    
app = FastAPI()

@app.get("/")
async def read_index():
    return FileResponse('index.html')

@app.get("/style.css")
async def read_index():
    return FileResponse('style.css')