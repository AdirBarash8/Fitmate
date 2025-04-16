import redis
import json

r = redis.Redis(host='localhost', port=6379, db=0, decode_responses=True)

"""def update_user_location(user_id, lat, lon):
    key = f"user:{user_id}:location"
    r.set(key, json.dumps({"lat": lat, "lon": lon}), ex=300)  # expires in 5 min"""

def get_live_location(user_id):
    key = f"user:{user_id}:location"
    value = r.get(key)
    if value:
        try:
            data = json.loads(value)
            return float(data["lat"]), float(data["lon"])
        except:
            return None
    return None
