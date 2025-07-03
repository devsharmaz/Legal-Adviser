from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import uvicorn

# from Legal_Fetch import Legal  # Import your Legal class
from Gemini_Legal_fetch import Legal

# --- FastAPI App Setup ---
app = FastAPI()

# Enable CORS (consider restricting origins in production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request model
class QueryRequest(BaseModel):
    user_query: str

# Response model
class RecommendationResponse(BaseModel):
    response: str

# Instantiate Legal class globally
legal_engine = Legal()

# --- Endpoint ---
@app.post("/recommend", response_model=RecommendationResponse)
def recommend_legal_advice(request: QueryRequest):
    try:
        response = legal_engine.get_Legal_Fetch(request.user_query)
        return RecommendationResponse(response=response)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Recommendation error: {str(e)}")

# --- Run the app ---
if __name__ == "__main__":
    uvicorn.run("server:app", host="127.0.0.1", port=8080, reload=True)
