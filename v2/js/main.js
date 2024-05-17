// inspo https://apps.npr.org/best-books/#view=covers&year=2023
// TODOs
  // use meta data for picture and description
  // nav bar on the top 
window.onbeforeunload = function () {
    window.scrollTo(0,0);
};

ICON_DICT = {
  "Article" : 'fa fa-newspaper-o',
  "Book": "fa fa-book",
  "Music": "fa fa-music",
  "Podcast": "fa fa-podcast",
  "Short Story / Poem": "fa fa-pagelines",
  "TV Show / Movie": "fa fa-film",
  "Video": "fa fa-video-camera",
  "Website": "fa fa-internet-explorer",
  "Other": "fa fa-question-circle"
}

// --- article class -----

class Article {
  constructor(article_data) {
    this.title = article_data.fields.title;
    this.pub_name = article_data.fields.pub_name;
    this.topics = article_data.fields.topics;
    this.link = article_data.fields.link;
    this.type = article_data.fields.type;
  }

  render(container_element) {
    const articleContent = document.querySelector("#article-template").content;
    let newArticle = articleContent.cloneNode(true);

    newArticle.querySelector("#article-title").textContent = this.title;
    newArticle.querySelector("#article-pub").textContent = this.pub_name;
    // create tag for each topic
    //console.log(this.name, this.topics)
    for (const tag of this.topics) {
      let tag_div = document.createElement('div');
      let tag_span = document.createElement('span');
      tag_div.className = 'tag'
      tag_span.className = `tag`
      tag_span.classList.add(tag.split(" ")[0])
      tag_span.textContent = tag
      newArticle.getElementById('tag-container').appendChild(tag_div)
      tag_div.appendChild(tag_span)
    } 

   
    let icon_div = document.createElement('i');
    icon_div.className = ICON_DICT[this.type]
  
    newArticle.querySelector("#article-type").appendChild(icon_div)
    newArticle.querySelector("#article-type").innerHTML += ` ${this.type}`
    newArticle.querySelector("a").href = this.link;
    container_element.appendChild(newArticle);
  }
};


// ------ helper functions --------

function filter(input) {
  let records = JSON.parse(sessionStorage.getItem("records"));

  type = document.querySelector("#type-select").value;
  topic = document.querySelector("#topic-select").value;

  if ((type == "All") & (topic == "All")) {
    filteredData = records;
  } else if (type == "All") {
    filteredData = records.filter((r) => r.fields.topics.includes(topic));
  } else if (topic == "All") {
    filteredData = records.filter((r) => r.fields.type == type);
  } else {
    filteredData = records.filter(
      (r) => (r.fields.type == type) & (r.fields.topic.includes(topic))
    );
  }

  renderArticles(filteredData)
  // only scroll up if under the div
  if (!checkVisible(document.getElementsByClassName('header')[0])) {
      document.getElementById('concierge').scrollIntoView()
  }
}

function renderArticles(data) {
  // remove any current content
  document.querySelectorAll(".article").forEach((a) => a.remove());

  document.querySelector("#article-count").textContent = data.length;
  const container = document.querySelector(".articles-container");
  data.forEach((article_data) => {
    //console.log(article_data)
    let newArticle = new Article(article_data);
    newArticle.render(container);
  });
}

function checkVisible(elm) {
  var rect = elm.getBoundingClientRect();
  var viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
  return !(rect.bottom < 0 || rect.top - viewHeight >= 0);
}

// ------------- init -----------------

function init() {
  let records = JSON.parse(sessionStorage.getItem("records"));
  //console.log(records)
  renderArticles(records);
  //location.reload() 
}
console.log("init")
init();
