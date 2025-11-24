from fastapi import FastAPI, HTTPException, Depends, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from .database import users_collection, history_collection
from .models import User, LoginData
from .auth import hash_password, verify_password, create_token
from ultralytics import YOLO
import base64, datetime, cv2, numpy as np

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

from .database import client

@app.get("/health/db")
def check_db_health():
    try:
        # The ping command is cheap and does not require auth
        client.admin.command('ping')
        return {"status": "healthy", "message": "MongoDB connection is successful"}
    except Exception as e:
        return {"status": "unhealthy", "message": str(e)}

model = YOLO("backend/best.pt")

@app.post("/register")
def register(user: User):
    if users_collection.find_one({"email": user.email}):
        raise HTTPException(status_code=400, detail="User already exists")
    user.password = hash_password(user.password)
    users_collection.insert_one(user.dict())
    return {"message": "User created successfully"}

@app.post("/login")
def login(data: LoginData):
    user = users_collection.find_one({"email": data.email})
    if not user or not verify_password(data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_token({"email": user["email"], "role": user["role"]})
    return {"token": token, "role": user["role"]}

def detect_image(image_bytes):
    img_array = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(img_array, cv2.IMREAD_COLOR)
    result = model(img)[0]

    labels = []
    for box in result.boxes:
        x1, y1, x2, y2 = box.xyxy[0].cpu().numpy()
        cls = int(box.cls[0])
        label = model.names[cls]
        labels.append(label)
        cv2.rectangle(img, (int(x1), int(y1)), (int(x2), int(y2)), (0, 255, 0), 2)
        cv2.putText(img, label, (int(x1), int(y1)-10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 255, 0), 2)

    _, buffer = cv2.imencode(".jpg", img)
    b64_image = base64.b64encode(buffer).decode()
    return b64_image, labels

@app.post("/upload")
async def upload(file: UploadFile = File(...)):
    image_bytes = await file.read()
    processed_image, labels = detect_image(image_bytes)

    history_collection.insert_one({
        "timestamp": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "labels": labels,
        "image": processed_image
    })
    return JSONResponse({"image": processed_image, "labels": labels})

@app.get("/history")
def get_history():
    return list(history_collection.find({}, {"_id": 0}))

@app.delete("/clear_history")
def clear_history():
    history_collection.delete_many({})
    return {"message": "History cleared successfully"}
