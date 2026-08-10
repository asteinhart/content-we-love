"""Pull the latest records from Airtable and write them to data/records.json.

Run locally with AIRTABLE_KEY set, or via the "Refresh data" GitHub Action.
"""

import os

from helper import clean_records

OUT_PATH = os.path.join(os.path.dirname(__file__), "data", "records.json")


def main():
    records = clean_records()  # already a JSON string

    os.makedirs(os.path.dirname(OUT_PATH), exist_ok=True)
    with open(OUT_PATH, "w") as f:
        f.write(records)

    print(f"wrote {OUT_PATH}")


if __name__ == "__main__":
    main()
