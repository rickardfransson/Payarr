from fastapi import FastAPI

app = FastAPI(
    title="Payarr API",
    version="0.1.0"
)

@app.get("/")
def root():
    return {
        "application": "Payarr",
        "version": "0.1.0",
        "status": "online"
    }

@app.get("/health")
def health():
    return {
        "status": "healthy"
    }