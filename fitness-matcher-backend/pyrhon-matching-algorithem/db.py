from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

client = MongoClient(os.getenv("MONGO_URI"))
db = client[os.getenv("MONGO_DB")]
users_collection = db["users"]

# ✅ Original: Get all users without filtering
def get_users_from_db():
    return list(users_collection.find({}, {"_id": 0}))

# ✅ Original: Get user by ID
def get_user_by_id(user_id):
    return users_collection.find_one({"user_id": user_id}, {"_id": 0})

# ✅ NEW: Get users filtered based on a current user's preferences
def get_filtered_users_for_matching(current_user):
    query = {
        "user_id": {"$ne": current_user["user_id"]}
    }

    # ✅ Filter by preferred partner gender
    gender_pref = current_user.get("Preferred_Partner_Gender")
    if not isinstance(gender_pref, list):
        gender_pref = []

    if "No Preference" not in gender_pref:
        query["Gender"] = {"$in": gender_pref}

    # ✅ Filter by preferred partner age range
    age_ranges = current_user.get("Preferred_Partner_Age_Range")
    if not isinstance(age_ranges, list):
        age_ranges = []

    age_bounds = []
    for r in age_ranges:
        if "-" in r:
            try:
                min_age, max_age = map(int, r.split("-"))
                age_bounds.append((min_age, max_age))
            except:
                pass

    if age_bounds:
        min_age = min(r[0] for r in age_bounds)
        max_age = max(r[1] for r in age_bounds)
        query["Age"] = {"$gte": min_age, "$lte": max_age}

    # ✅ Filter by Workout_Type overlap
    workout_types = current_user.get("Workout_Type")
    if isinstance(workout_types, list) and workout_types:
        query["Workout_Type"] = {"$in": workout_types}

    return list(users_collection.find(query, {"_id": 0}))
