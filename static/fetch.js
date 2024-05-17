// ---- grab data from API -----
function sortSet(data) {
    data.sort(
      (a, b) =>
        b.is_image.toString().localeCompare(a.is_image.toString()) ||
        Date.parse(b.pub_date) - Date.parse(a.pub_date)
    );
    sessionStorage.setItem("records", JSON.stringify(data));
  }
  
  fetch("/api/records")
    .then((data) => data.json())
    .then((data) => sortSet(data));
  