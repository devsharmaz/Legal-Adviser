![image](https://github.com/user-attachments/assets/4ca3f728-cc88-4bf0-980c-a6260928a42c)
<img width="920" height="840" alt="image" src="https://github.com/user-attachments/assets/4afe0ccf-f090-43da-afc2-578d8b7fa0e3" />
<img width="927" height="835" alt="image" src="https://github.com/user-attachments/assets/d5b39afc-93b5-4d34-a77d-d6f064cae2a6" />
<img width="939" height="819" alt="image" src="https://github.com/user-attachments/assets/a16e56e1-8010-4ce0-8f85-5e7bd3db1905" />


# Bharatiya Nyaya Sanhita AI Advisor

## Overview

Bharatiya Nyaya Sanhita AI Advisor is a project designed to provide information about the sections and corresponding punishments outlined in the Bharatiya Nyaya Sanhita. It leverages AI to understand user queries and retrieve relevant legal information.

## Key Components

The project is structured into three main parts:

*   **`backend/`**: A Python FastAPI application that handles the core logic.
    *   `server.py`: Contains the main API logic for processing requests and generating responses.
    *   `gemini_manager.py`: Manages interactions with the Gemini API to understand the intent and entities in user queries.
    *   `pinecone_manager.py`: Handles the storage of vector embeddings and performs similarity searches using Pinecone to find relevant sections.
    *   `recommendation.py`: Orchestrates the overall process of generating information based on user queries.
*   **`frontend/`**: A application that provides the user interface for interacting with the AI advisor.
*   **`data/`**: Contains the raw data used by the system. The primary dataset is in `.csv` format, which presumably contains the sections and punishment details of the Bharatiya Nyaya Sanhita.

## How it Works

1.  A user submits a query through the frontend.
2.  The frontend sends the query to the FastAPI backend.
3.  The `gemini_manager.py` in the backend processes the user's natural language query using the Gemini API to understand its meaning and extract key information.
4.  Based on the processed query, `pinecone_manager.py` creates vector embeddings and searches a Pinecone vector database for sections of the Bharatiya Nyaya Sanhita that are semantically similar to the user's query.
5.  The `recommendation.py` module takes the relevant sections retrieved from Pinecone and orchestrates the generation of a response, likely providing details about the sections and their associated punishments.
6.  The backend sends the generated information back to the frontend, which then displays it to the user.

## Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url> # Replace <repository-url> with the actual URL
    cd <repository-folder>
    ```

2.  **Configure Backend Environment Variables:**
    The backend requires API keys for Groq and Pinecone.
    *   Navigate to the backend directory:
        ```bash
        cd backend
        ```
    *   Copy the example environment file:
        ```bash
        # For Windows
        copy .env.example .env
        # For macOS/Linux
        cp .env.example .env
        ```
    *   Open the `.env` file and add your API keys:
        ```env
        GEMINI_API_KEY="your_gemini_api_key"
        GEMINI_MODEL="gemini-1.5-flash" # Or your preferred model, e.g., gemini-1.0-pro
        PINECONE_API_KEY="your_pinecone_api_key"
        PINECONE_ENVIRONMENT="your_pinecone_environment" # e.g., "us-west1-gcp" or "us-east-1-aws" - find this in your Pinecone console
        PINECONE_INDEX_NAME="your_pinecone_index_name" # Choose a name for your index
        ```
    *   Return to the root directory:
        ```bash
        cd ..
        ```

3.  **Set up and populate the Pinecone Database:**
    *(Instructions for this step need to be added. This typically involves running a script to process the `.csv` data, generate embeddings, and upload them to your Pinecone index.)*

## Usage

commands to start server:
```bash
`python server.py` 
`npm run dev`
```

## Project Structure

```
<repository-folder>/
├── backend/
│   ├── server.py           # Main API logic
│   ├── gemini_manager.py   # Handles calls to the Gemini API
│   ├── pinecone_manager.py # Handles Pinecone vector database operations
│   ├── recommendation.py   # Orchestrates recommendation generation
│   ├── .env.example        # Example environment variables file
│   └── .env                # Actual environment variables (gitignored)
├── frontend/
│   └── ...                 # React application (built with Vite)
├── data/
│   └── *.csv               # Primary dataset(s)
└── README.md
```


