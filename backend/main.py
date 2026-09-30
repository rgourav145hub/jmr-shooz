from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import sys
import os
import platform
import time

app = FastAPI(
    title="DevCraft Backend Service",
    description="High-performance Python backend service for web applications and software.",
    version="1.0.0"
)

# Allow CORS for local frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

start_time = time.time()

class ProjectItem(BaseModel):
    id: int
    title: str
    description: str
    status: str

items_db: List[ProjectItem] = [
    ProjectItem(id=1, title="Authentication Module", description="JWT based auth flow", status="Planned"),
    ProjectItem(id=2, title="Analytics Dashboard", description="Real-time event charts", status="In Progress"),
    ProjectItem(id=3, title="Export to PDF/CSV", description="Background report generation", status="Done"),
]

@app.get("/")
def read_root():
    return {
        "message": "DevCraft Backend Service is Running",
        "docs": "http://localhost:8000/docs",
        "status": "healthy"
    }

@app.get("/api/health")
def get_health():
    return {
        "status": "online",
        "uptime_seconds": round(time.time() - start_time, 2),
        "service": "FastAPI",
        "platform": platform.platform(),
        "python_version": sys.version.split()[0]
    }

@app.get("/api/info")
def get_info():
    return {
        "workspace": "DevCraft Web & Software Workspace",
        "system": platform.system(),
        "architecture": platform.machine(),
        "python": sys.version,
        "features": [
            "Automatic OpenAPI Docs at /docs",
            "CORS configured for React/Vite",
            "Pydantic schema validation"
        ]
    }

@app.get("/api/items", response_model=List[ProjectItem])
def list_items():
    return items_db

@app.post("/api/items", response_model=ProjectItem)
def create_item(item: ProjectItem):
    items_db.append(item)
    return item

if __name__ == "__main__":
    import uvicorn
    print("Starting DevCraft Backend at http://localhost:8000 ...")
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
