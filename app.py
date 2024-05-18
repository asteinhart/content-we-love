from helper import clean_records
from flask import Flask, render_template

# flask --app app --debug run

# flask is just allowing me to interact with url parameters
app = Flask(__name__)
app.secret_key = "paoisdhjfgsalkjdfh"


@app.route("/")
def home():
    return render_template("home.html")


@app.route("/about")
def about():
    return render_template("about.html")


@app.route("/api/records")
def fetch_articles():
    records = clean_records()
    return records


if __name__ == "__main__":
    app.run(debug=True)
