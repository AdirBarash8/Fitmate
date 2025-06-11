import pandas as pd
import numpy as np
from scipy.spatial.distance import mahalanobis
from math import radians, sin, cos, sqrt, atan2
from location_cache import get_live_location
from sklearn.preprocessing import StandardScaler

STRUCTURED_FEATURES = ["Age", "Motivation_Level", "Travel_Willingness_km"]

MULTI_CHOICE_FEATURES = [
    "Preferred_Workout_Time", "Fitness_Goal", "Workout_Type",
    "Workout_Style", "Coaching_Preference",
    "Preferred_Partner_Gender", "Preferred_Partner_Experience_Level"
]

# Weights for structured features: [Age, Motivation_Level, Travel_Willingness_km]
FEATURE_WEIGHTS = np.array([1.0, 2.0, 1.5])
#FEATURE_WEIGHTS = np.array([1.0, 3.0, 2.0])  # [Age, Motivation_Level, Travel_Willingness_km]

# Haversine distance in km
def haversine(lat1, lon1, lat2, lon2):
    R = 6371.0
    dlat = radians(lat2 - lat1)
    dlon = radians(lon2 - lon1)
    a = sin(dlat/2)**2 + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlon/2)**2
    c = 2 * atan2(sqrt(a), sqrt(1 - a))
    return R * c

def list_overlap_score(list1, list2):
    try:
        s1, s2 = set(list1), set(list2)
        return len(s1 & s2) / len(s1 | s2) if s1 | s2 else 0
    except:
        return 0

def age_range_match_score(user, other):
    ranges = user.get("Preferred_Partner_Age_Range", [])
    if not isinstance(ranges, list):
        ranges = [ranges]
    other_age = other.get("Age", 0)
    for r in ranges:
        if r == "Any":
            return 1
        try:
            min_age, max_age = map(int, r.split("-"))
            if min_age <= other_age <= max_age:
                return 1
        except:
            continue
    return 0

def gender_match_score(user, other):
    preferences = user.get("Preferred_Partner_Gender", [])
    if not isinstance(preferences, list):
        preferences = [preferences]
    return 1 if "No Preference" in preferences or other.get("Gender") in preferences else 0

def available_days_score(user, other):
    return list_overlap_score(user.get("Available_Days", []), other.get("Available_Days", []))

def encode_for_mahalanobis(users):
    df = pd.DataFrame(users)
    df = df.dropna(subset=STRUCTURED_FEATURES + ["user_id"])
    df["user_id"] = df["user_id"].astype(int)

    motivation_map = {"Low": 1, "Medium": 2, "High": 3}
    df["Motivation_Level"] = df["Motivation_Level"].map(motivation_map)

    df_numeric = df[STRUCTURED_FEATURES].astype(float).fillna(0)
    df_weighted = df_numeric * FEATURE_WEIGHTS

    scaler = StandardScaler()
    df_scaled = pd.DataFrame(scaler.fit_transform(df_weighted), columns=STRUCTURED_FEATURES)

    return df_scaled.reset_index(drop=True), df["user_id"].tolist(), df.reset_index(drop=True)

def find_hybrid_matches(user_id, all_users, top_n=5):
    df_encoded, user_ids, raw_df = encode_for_mahalanobis(all_users)

    try:
        idx = raw_df[raw_df["user_id"] == user_id].index[0]
    except IndexError:
        raise ValueError("User ID not found")

    target_user = raw_df.iloc[idx].to_dict()
    target_vector = df_encoded.iloc[idx].values
    inv_cov = np.linalg.pinv(np.cov(df_encoded.T))

    live_coords = get_live_location(user_id)
    if live_coords:
        base_lat, base_lon = live_coords
    else:
        base_lat = target_user["home_location"]["lat"]
        base_lon = target_user["home_location"]["lon"]

    scores = []
    for i, row in df_encoded.iterrows():
        if i == idx:
            continue

        other_user = raw_df.iloc[i].to_dict()
        current_vector = row.values

        other_live = get_live_location(other_user["user_id"])
        if other_live:
            other_lat, other_lon = other_live
        else:
            other_lat = other_user["home_location"]["lat"]
            other_lon = other_user["home_location"]["lon"]

        distance = haversine(base_lat, base_lon, other_lat, other_lon)
        geo_score = max(0, 1 - min(distance / 20, 1))

        user_travel = target_user.get("Travel_Willingness_km", 0)
        other_travel = other_user.get("Travel_Willingness_km", 0)
        travel_ok = distance <= user_travel and distance <= other_travel

        if not travel_ok:
            continue

        dist = mahalanobis(target_vector, current_vector, inv_cov)
        dist_score = np.exp(-dist)

        overlap_scores = {
            field: list_overlap_score(target_user.get(field, []), other_user.get(field, []))
            for field in MULTI_CHOICE_FEATURES
        }
        composite_overlap = sum(overlap_scores.values()) / len(MULTI_CHOICE_FEATURES)

        age_score = age_range_match_score(target_user, other_user)
        gender_score = gender_match_score(target_user, other_user)
        days_score = available_days_score(target_user, other_user)

        final_score = (
            0.4 * dist_score +
            0.25 * composite_overlap +
            0.1 * days_score +
            0.1 * age_score * gender_score +
            0.1 * geo_score +
            0.05 * 1
        )

        scores.append({
            "user_id": user_ids[i],
            "hybrid_score": round(final_score, 3),
            "distance": round(distance, 3),
            "overlap_score": round(composite_overlap, 3),
            "days_overlap": round(days_score, 3),
            "gender_match": gender_score,
            "age_match": age_score
        })

    scores.sort(key=lambda x: x["hybrid_score"], reverse=True)
    return scores[:top_n]
