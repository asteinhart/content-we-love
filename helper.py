# from env import KEY  # for local testing
import requests
import pandas as pd
import numpy as np
import json
import os


def airtable_request(url_base):

    # AIRTABLE_KEY = KEY  # for local testing

    AIRTABLE_KEY = os.environ.get("AIRTABLE_KEY")

    headers = {"Authorization": f"Bearer {AIRTABLE_KEY}"}
    offset = 0
    record_list = []

    while offset is not None:
        if offset != 0:
            url = url_base + "?offset=" + offset
        else:
            url = url_base

        response = requests.request("GET", url, headers=headers)

        responses = response.json()
        r = [r for r in responses["records"]]
        record_list += r
        offset = responses.get("offset")

    return record_list


def add_image(row, clean_meta):
    for r in clean_meta:
        if r.get("image") and r.get("url"):
            if r["url"] == row["link"].split("?")[0]:
                return r["image"]


def add_description(row, clean_meta):
    for r in clean_meta:
        if r.get("description") and r.get("url"):
            if r["url"] == row["link"].split("?")[0]:
                return r["description"]


def pull_records():

    article_url = "https://api.airtable.com/v0/appfRI9pJ5OIOt9LV/for_api"
    article_list = airtable_request(article_url)
    art_df = pd.DataFrame([r["fields"] for r in article_list])

    tab_url = "https://api.airtable.com/v0/appfRI9pJ5OIOt9LV/the_tab"
    tab_list = airtable_request(tab_url)
    tab_df = pd.DataFrame([r["fields"] for r in tab_list])

    pubs_url = "https://api.airtable.com/v0/appfRI9pJ5OIOt9LV/Publications"
    pub_list = airtable_request(pubs_url)
    pub_list_clean = {r["id"]: r["fields"]["Name"] for r in pub_list}

    art_df["tags"] = art_df["tags"].fillna("").apply(list)
    art_df["topics"] = art_df["topic"] + art_df["tags"]
    art_df["type"] = "Article"
    art_df["pub"] = art_df["pub"].str[0].map(pub_list_clean)

    art_clean = art_df[["title", "pub", "link", "topics", "type", "pub_date"]]

    tab_df["pub"] = ""
    tab_df["topics"] = tab_df["topic"].str.split("-")
    tab_clean = tab_df[["title", "pub", "link", "topics", "type", "pub_date"]]

    records = pd.concat([art_clean, tab_clean]).reset_index(drop=True)

    return records


def clean_records():
    # pull in data and format

    records = pull_records()

    with open("clean_meta.json", "r") as file:
        clean_meta = json.load(file)

    records["image"] = records.apply(add_image, args=(clean_meta,), axis=1)
    records["description"] = records.apply(add_description, args=(clean_meta,), axis=1)

    records["is_image"] = np.where(records["image"].notna(), True, False)

    # one weird
    records["image"] = np.where(
        records["image"] == "scale~1200x1200~0807ffrock-1470254958-36.jpg",
        "",
        records["image"],
    )

    return records.to_json(orient="records")
