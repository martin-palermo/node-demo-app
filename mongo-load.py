from pymongo import MongoClient
import random

# Connect to MongoDB
client = MongoClient("mongodb://localhost:27017/")
db = client["mongoDemoDB"]
users_collection = db["users"]

# Dummy data
names = ["john", "jane", "alice", "bob", "charlie", "dave"]
countries = ["USA", "Canada", "UK", "Australia", "Germany", "France"]

# Inserting 100 dummy users
for _ in range(100):
    user = {
        "username": random.choice(names) + str(random.randint(1, 1000)),
        "password": "password" + str(random.randint(1, 1000)),
        "email": random.choice(names) + str(random.randint(1, 1000)) + "@example.com",
        "age": random.randint(18, 60),
        "country": random.choice(countries)
    }
    users_collection.insert_one(user)

print("Dummy users inserted!")

