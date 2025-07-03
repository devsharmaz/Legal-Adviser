from google.generativeai import configure, GenerativeModel
import os
from dotenv import load_dotenv

class GeminiManager:
    def __init__(self):
        load_dotenv(override=True)

        api_key = os.environ.get("GEMINI_API_KEY")
        model_name = os.environ.get("GEMINI_MODEL")

        assert api_key, "GEMINI_API_KEY is missing in environment"
        assert model_name, "GEMINI_MODEL is missing in environment"

        configure(api_key=api_key)
        self.model = GenerativeModel(model_name)

    def get_answer(self, prompt: str) -> str:
        response = self.model.generate_content(prompt)
        return response.text.strip()
