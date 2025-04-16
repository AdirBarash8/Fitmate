from pymongo import MongoClient
import pprint

client = MongoClient("mongodb://localhost:27017")
db = client["fitness_app"]
collection = db["users"]

# Fetch and inspect a few documents
sample_users = list(collection.find({}, {"_id": 0}).limit(5))

print("Sample users from MongoDB:")
pprint.pprint(sample_users)
