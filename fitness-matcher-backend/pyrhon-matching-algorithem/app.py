from flask import Flask, request, jsonify
from db import get_users_from_db
from db import get_user_by_id, get_filtered_users_for_matching
from matcher import find_hybrid_matches
from collections import OrderedDict
#from location_cache import update_user_location


app = Flask(__name__)

""" @app.route("/api/update_location", methods=["POST"])
def update_location():
    data = request.json
    user_id = data.get("user_id")
    lat = data.get("lat")
    lon = data.get("lon")

    if not all([user_id, lat, lon]):
        return jsonify({"error": "Missing user_id, lat, or lon"}), 400

    update_user_location(int(user_id), float(lat), float(lon))
    return jsonify({"status": "Location updated ✅"}) """

@app.route("/match", methods=["GET"])
def match_users():
    user_id = request.args.get("user_id")
    top_n = request.args.get("top_n", default=5)

    if not user_id:
        return jsonify({"error": "Missing user_id"}), 400

    try:
        user_id = int(user_id)
        top_n = int(top_n)

        #all_users = get_users_from_db()
        current_user = get_user_by_id(user_id)
        if not current_user:
            return jsonify({"error": "User not found"}), 404

        # Only fetch potential match candidates based on preferences
        filtered_others = get_filtered_users_for_matching(current_user)
        all_users = [current_user] + filtered_others  # 👈 Add user to list
        matches = find_hybrid_matches(user_id, all_users)
        
        user_dict = {user["user_id"]: user for user in all_users}
        enriched = []
        ranked_overview = []

        for idx, match in enumerate(matches):
            profile = user_dict.get(match["user_id"])
            enriched.append({
                "rank": idx + 1,
                "user_id": match["user_id"],
                "score": match["hybrid_score"],
                "distance": match.get("distance"),
                "overlap_score": match.get("overlap_score"),
                "days_overlap": match.get("days_overlap"),
                "gender_match": match.get("gender_match"),
                "age_match": match.get("age_match"),
                "profile": profile
            })

            ranked_overview.append({
                "rank": idx + 1,
                "user_id": match["user_id"],
                "score": match["hybrid_score"]
            })

        response = OrderedDict()
        response["summary"] = {
            "user_id": user_id,
            "top_n": top_n,
            "total_matches": len(enriched)
        }
        response["ranks"] = ranked_overview
        response["matches"] = enriched


        return jsonify(response)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
