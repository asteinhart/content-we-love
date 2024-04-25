from env import KEY
import requests
import json
import pandas as pd
from flask import Flask, render_template, request, session
from flask_session import Session

# flask is just allowing me to interact with url parameters
app = Flask(__name__)

SESSION_TYPE = "filesystem"

Session(app)

article_list = []


@app.route("/fetch", methods=["GET"])
def fetch():
    url_base = "https://api.airtable.com/v0/appfRI9pJ5OIOt9LV/Articles"
    global article_list
    headers = {"Authorization": f"Bearer {KEY}"}
    offset = 0

    while offset is not None:
        if offset != 0:
            url = url_base + "?offset=" + offset
        else:
            url = url_base

        response = requests.request("GET", url, headers=headers)

        articles = response.json()
        a = [a["fields"] for a in articles["records"]]
        article_list += a
        session["articles"] = article_list
        offset = articles.get("offset")

    total_articles = len(article_list)

    return render_template(
        "index.html", articles=article_list, total_articles=total_articles
    )


@app.route("/filter")
def filter():
    filter = request.args.get("filter-param")
    # df = pd.DataFrame(article_list)
    print(session)
    return render_template("index.html", articles="test", data={})
