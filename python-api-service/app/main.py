from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import todos

app = FastAPI(
    title="Todo API",
    description="A simple in-memory todo list API",
    version="0.1.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, you'd limit this to your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(todos.router)

@app.get("/")
async def root():
    return {"message": "Welcome to the Todo API. Go to /docs for the API documentation."}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True) 