// inspo https://apps.npr.org/best-books/#view=covers&year=2023
// TODOs
// have things load in the right order (js fetch, then html, then js make page?)
// where to put API Key (https://stackoverflow.com/questions/3764366/how-do-i-add-api-keys-and-other-secure-stuff-to-heroku)
// cheapest option to deploy (singular app.... means what?)
// add favorites
// clean up about section 

window.onbeforeunload = function () {
  window.scrollTo(0, 0);
};

ICON_DICT = {
  'Article': "fa fa-newspaper-o",
  'Book': "fa fa-book",
  'Music': "fa fa-music",
  'Podcast': "fa fa-podcast",
  "Short Story / Poem": "fa fa-pagelines",
  "TV Show / Movie": "fa fa-film",
  'Video': "fa fa-video-camera",
  'Website': "fa fa-internet-explorer",
  'Other': "fa fa-question-circle",
};


// --- article class -----

class Article {
  constructor(article_data) {
    this.title = article_data.title;
    this.pub_name = article_data.pub_name;
    this.topics = article_data.topics;
    this.link = article_data.link;
    this.type = article_data.type;
    this.image = article_data.image;
    this.description = article_data.description;
  }

  render_list(container_element) {
    const articleContent = document.querySelector(
      "#article-list-template"
    ).content;
    let newArticle = articleContent.cloneNode(true);

    newArticle.querySelector("#article-title").textContent = this.title;
    newArticle.querySelector("#article-pub").textContent = this.pub_name;

    // create tag for each topic
    //console.log(this.name, this.topics)
    for (const tag of this.topics) {
      let tag_div = document.createElement("div");
      let tag_span = document.createElement("span");
      tag_div.className = "tag";
      tag_span.className = `tag`;
      tag_span.classList.add(tag.split(" ")[0]);
      tag_span.textContent = tag;
      newArticle.getElementById("tag-container-list").appendChild(tag_div);
      tag_div.appendChild(tag_span);
    }

    let icon_div = document.createElement("i");
    icon_div.className = ICON_DICT[this.type];

    newArticle.querySelector("#article-type").appendChild(icon_div);
    newArticle.querySelector("#article-type").innerHTML += ` ${this.type}`;
    newArticle.querySelector("a").href = this.link;
    container_element.appendChild(newArticle);
  }

  render_grid(container_element) {
    const articleContent = document.querySelector(
      "#article-grid-template"
    ).content;
    let newArticle = articleContent.cloneNode(true);

    let icon_div = document.createElement("i");
    icon_div.className = ICON_DICT[this.type];
    icon_div.classList.add("autowidth");

    if (this.image) {
      newArticle.querySelector("#img img").src = this.image;
    } else {
      let icon_div = document.createElement("i");
      icon_div.className = ICON_DICT[this.type];
      newArticle.querySelector("#img").innerHTML = " ";
      newArticle.querySelector("#img").appendChild(icon_div);
    }

    newArticle.querySelector("#article-title").textContent = this.title;

    if (this.description) {
      newArticle.querySelector("#article-descrip").textContent =
        this.description;
    } else {
      newArticle.querySelector("#article-descrip").textContent =
        "No description available.";
    }

    for (const tag of this.topics) {
      let tag_div = document.createElement("div");
      let tag_span = document.createElement("span");
      tag_div.className = "tag";
      tag_span.className = `tag`;
      tag_span.classList.add(tag.split(" ")[0]);
      tag_span.textContent = tag;
      newArticle.getElementById("tag-container-grid").appendChild(tag_div);
      tag_div.appendChild(tag_span);
    }

    newArticle.querySelector("#article-type").appendChild(icon_div);
    newArticle.querySelector("#article-type").innerHTML += ` ${this.type}`;
    newArticle.querySelector("a").href = this.link;
    container_element.appendChild(newArticle);
  }
}

// ------ helper functions --------

function filter(input) {
  let records = JSON.parse(sessionStorage.getItem("records"));

  type = document.querySelector("#type-select").value;
  topic = document.querySelector("#topic-select").value;

  layout = document.querySelector('input[name="view-controls"]:checked').value;
  console.log(layout);

  if ((type == "All") & (topic == "All")) {
    filteredData = records;
  } else if (type == "All") {
    filteredData = records.filter((r) => r.topics.includes(topic));
  } else if (topic == "All") {
    filteredData = records.filter((r) => r.type == type);
  } else {
    filteredData = records.filter(
      (r) => (r.type == type) & r.topic.includes(topic)
    );
  }

  renderArticles(filteredData, layout);
  // only scroll up if under the div
  if (!checkVisible(document.getElementsByClassName("header")[0])) {
    document.getElementById("concierge").scrollIntoView();
  }
}

function renderArticles(data, layout) {
  // remove any current content
  document.querySelectorAll(".article").forEach((a) => a.remove());

  const articlesContainer = document.querySelector(".articles-container");
  console.log();
  if (layout == "grid") {
    articlesContainer.classList.remove("list");
    articlesContainer.classList.add("grid");
  } else {
    articlesContainer.classList.remove("grid");
    articlesContainer.classList.add("list");
  }

  document.querySelector("#article-count").textContent = data.length;

  data.forEach((article_data) => {
    //console.log(article_data)
    let newArticle = new Article(article_data);
    if (layout == "grid") {
      newArticle.render_grid(articlesContainer);
    } else {
      newArticle.render_list(articlesContainer);
    }
  });
}

function checkVisible(elm) {
  var rect = elm.getBoundingClientRect();
  var viewHeight = Math.max(
    document.documentElement.clientHeight,
    window.innerHeight
  );
  return !(rect.bottom < 0 || rect.top - viewHeight >= 0);
}

function layoutChange(input) {
  let records = JSON.parse(sessionStorage.getItem("records"));
  renderArticles(records, input);
}

// ---- event listeners ----
// if mobile force grid layout

var onResize = function(e) {
  //note i need to pass the event as an argument to the function
  if (window.innerWidth < 750) {
    layoutButtons = document.querySelector(".controls")
    layoutButtons.style.visibility = 'hidden'
    let records = JSON.parse(sessionStorage.getItem("records"));
    renderArticles(records, "grid");
  } else {
    layoutButtons.style.visibility = 'visible'
    document.getElementById('view-grid').checked = true;


  }
  
}

window.addEventListener("resize", onResize);

// ------------- init -----------------

function init() {
  let records = JSON.parse(sessionStorage.getItem("records"));
  renderArticles(records, "grid");
}

init();
