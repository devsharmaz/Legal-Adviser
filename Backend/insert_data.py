import csv
from Pinecone_Manager import PineconeManager
from time import sleep

def read_and_batch_ipc_csv(file_path):
    records = []

    with open(file_path, newline='', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        for idx, row in enumerate(reader, 1):
            section_id = f"{row['Section'].strip()}-{row['Section _name'].strip()}"
            legal_text = (
                f"Chapter {row['Chapter'].strip()} titled '{row['Chapter_name'].strip()}', "
                f"under subtype '{row['Chapter_subtype'].strip()}', includes Section {row['Section'].strip()} - "
                f"'{row['Section _name'].strip()}'. The section states: {row['Description'].strip()}"
            )

            records.append({
                "_id": section_id,
                "legal-text": legal_text
            })

    # Split into batches of 96
    batch_size = 96
    return [records[i:i + batch_size] for i in range(0, len(records), batch_size)]

# Initialize Pinecone
pm = PineconeManager()

file_path = r'..\data\bns_sections.csv'  # <-- Update to your file
ipc_records_list = read_and_batch_ipc_csv(file_path)
print(f"Number of batches: {len(ipc_records_list)}")

for count, batch in enumerate(ipc_records_list, 1):
    print(f"Inserting batch {count} with {len(batch)} records...")
    pm.insert_data(batch)

    if count % 10 == 0:
        print(f"Inserted {count} batches. Waiting 5 seconds to avoid rate limits...")
        sleep(5)

print("✅ All IPC records inserted successfully.")
