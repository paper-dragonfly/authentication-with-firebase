from fastapi import FastAPI, Header
from http import HTTPStatus
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from firebase_admin import credentials, auth
import firebase_admin
import pdb
import time
#For creating an encrypted token
from cryptography.fernet import Fernet

# Crete app
app = FastAPI()


FAKE_DB = {
    'name': ['nico', 'liz', 'Kathleen Noble', 'kat'], 
    'email':['nico@example.com', 'liz@example.come', 'k@example.com', 'kat@example.com'], 
    'user_id':['123moonshine', '321lizzkadoodle', '3aXlr46EU4fmv1yrv7ZIj1L8QMG2', '9KiwPexTflMfJmwTQOmYV0CImDw1'] 
    }

SECRET_STRING = 'hash_me_baby_one_more_time'

#generate key for encrypting and decrypting
KEY = Fernet.generate_key()

#create a Fernet instance using KEY
fernet = Fernet(KEY)


class Response(BaseModel):
    status_code:int = 200
    error_message: str = None
    body: dict = None 
 
# Add CORS middleware to the app to allow cross-origin communication
origins = ["http://localhost:3000", "http://localhost:3001"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#initialize Firebase Admin SDK
#note: can also store credentials as environment variable: export GOOGLE_APPLICATION_CREDENTIALS =  'path/to/sercice-account-key.json'
cred =  credentials.Certificate("learn-auth-0423-firebase-adminsdk-key.json")
firebase_admin.initialize_app(cred)

# API Endpoints
@app.get("/health/")
def read_health():
    return Response(status_code=HTTPStatus.OK)

@app.get("/login/")
def read_login(authorization: str  = Header(...)):
    id_token = authorization.split(" ")[1]
    print('Auth val: ', authorization)
    try:
        # added delay because I was getting an auth.InvalidIdTokenError "Token used too early" - could be my computer clock is slightly different to the firebase server.  
        # Yes,  I know, this is a super hacky fix and there's probably a better solution but it works! 
        time.sleep(0.1)
        decoded_token = auth.verify_id_token(id_token)
        print('decoded token ', decoded_token)
        # token is valid
        user_id = decoded_token['uid']
        # check if user in db
        if not user_id in FAKE_DB['user_id']:
            # name = decoded_token["name"]
            # email = decoded_token["email"]
            # user_id = decoded_token['uid']
            FAKE_DB["name"].append(decoded_token["name"])
            FAKE_DB["email"].append(decoded_token["email"])
            FAKE_DB["user_id"].append(user_id)
        # create personal hash token
        unencrypted_string = SECRET_STRING+"BREAK"+user_id
        encrypted_token = fernet.encrypt(unencrypted_string.encode())
    except  auth.InvalidIdTokenError as err:
        print("Error: ",  str(err))
        #Token invalid
        return Response(status_code=400, error_message='Token invalid')
    except:
        return Response(status_code=400, error_message='no token recieved or other issue')
    return Response(body={'user_token': encrypted_token})

@app.get("/email/")
def read_email(authorization:  str = Header(...)):
    user_token = authorization.split(" ")[1]
    # decrypt token
    decMessage_list = fernet.decrypt(user_token).decode().split("BREAK")
    print(decMessage_list) 
    if decMessage_list[0] != SECRET_STRING:
        return Response(status_code=401, error_message='Invalid userToken')
    else:
        email = FAKE_DB["email"][FAKE_DB["user_id"].index(decMessage_list[1])]
        return Response(body={'user_email': email})