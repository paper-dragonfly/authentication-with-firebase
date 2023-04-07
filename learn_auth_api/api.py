from fastapi import FastAPI
from http import HTTPStatus
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from firebase_admin import credentials, auth
import firebase_admin


app = FastAPI()

class TodoSchema(BaseModel):
    userToken: str

class Response(BaseModel):
    status_code:int = 200
    error_message: str = None
    body: dict = None 
 
origins = ["http://localhost:3001"]
# Add CORS middleware to the app
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#initialize Firebase Admin SDK
cred =  credentials.Certificate("/path/to/serviceAccountKey")
firebase_admin.initialize_app(cred)


@app.get("/health/")
def read_health():
    return {"API status": HTTPStatus.OK}

@app.get("/todo/")
def read_todo(userToken: TodoSchema):
    try:
        decoded_token = auth.verify_id_token(userToken)
        # token is valid
        user_id = decoded_token['uid']
        # Do something with user_id
    except  auth.InvalidIdTokenError:
        #Token invalid
        return Response(status_code=400, error_message='Token invalid')
    except:
        return Response(status_code=400, error_message='no token recieved or other issue')
    return Response(body={'todos': ['cut hair', 'erg', 'make food']})