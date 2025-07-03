import os
from dotenv import load_dotenv
from groq import Groq

class Groqmanager:
    def __init__(self):
        load_dotenv(override=True)
        self.client = Groq(
            api_key=os.environ.get("GROQ_API_KEY"),
        )

    def get_answer(self, messages):
        chat_completion = self.client.chat.completions.create(
            messages=messages,
            model=os.environ.get("GROQ_MODEL"),
        )
        return chat_completion.choices[0].message.content
