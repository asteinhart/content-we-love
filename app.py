from env import KEY
import requests
from flask import Flask, render_template, request

# flask is just allowing me to interact with url parameters
app = Flask(__name__)


@app.route("/fetch", methods=["GET"])
def hello_input():
    url = "https://api.airtable.com/v0/appfRI9pJ5OIOt9LV/Articles"
    headers = {"Authorization": f"Bearer {KEY}"}

    response = requests.request("GET", url, headers=headers)
    articles = response.json()

    return render_template("index.html", articles=articles, data=articles)


@app.route("/")
def get_all_schools():

    return render_template("index.html", articles="test", data={})
