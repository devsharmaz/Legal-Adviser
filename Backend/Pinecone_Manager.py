import os
from dotenv import load_dotenv
from pinecone import Pinecone


class PineconeManager:
    def __init__(self):
        load_dotenv(override=True)
        self.pinecone_client = Pinecone(api_key=os.environ.get("PINECONE_API_KEY"))
        self.index_name = os.environ.get("INDEX_NAME", "legal-data")
        self.namespace = "ipc-namespace"
        self.create_namespace()


    def create_namespace(self):
        index_name = "legal-data"
        if not self.pinecone_client.has_index(index_name):
            self.pinecone_client.create_index_for_model(
                name = index_name,
                cloud="aws",
                region="us-east-1",
                embed={
                    "model":"llama-text-embed-v2",
                    "field_map":{"text": "legal-text"}
                }
            )


    def insert_data(self, records):
         # Target the index
        dense_index = self.pinecone_client.Index(self.index_name)

        # Upsert the records into a namespace
        dense_index.upsert_records(namespace=self.namespace, records=records)


    def query_index(self, user_query, top_K=10):
        dense_index = self.pinecone_client.Index(self.index_name)

        response = dense_index.search(
            namespace=self.namespace,
            query={
                "top_k": top_K,
                "inputs": {
                    "text": user_query
                }
            }
        )

        results = []
        for hit in response['result']['hits']:
                results.append(f"id: {hit['_id']:<5} | score: {round(hit['_score'], 2):<5} | text: {hit['fields']['legal-text']:<50}")
        
        return results   



