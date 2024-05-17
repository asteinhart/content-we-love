function fetchData() {
    let Airtable = require("airtable");
    let base = new Airtable({ apiKey: KEY }).base("appfRI9pJ5OIOt9LV");
  
    // records
    all_records = [];
    base("for_api")
      .select({
        // Selecting the first 3 records in All Articles:
        maxRecords: 400,
        view: "All Articles",
      })
      .eachPage(
        function page(records, fetchNextPage) {
          // This function (`page`) will get called for each page of records.
  
          all_records = [...all_records, ...records];
          sessionStorage.setItem("records_raw", JSON.stringify(all_records));
  
          // To fetch the next page of records, call `fetchNextPage`.
          // If there are more records, `page` will get called again.
          // If there are no more records, `done` will get called.
          fetchNextPage();
        },
        function done(err) {
          if (err) {
            console.error(err);
            return;
          }
        }
      );
  
    // publications
    all_pubs = [];
    base("Publications")
      .select({
        // Selecting the first 3 records in Main View:
        maxRecords: 100,
        view: "Main View",
      })
      .eachPage(
        function page(pubs, fetchNextPage) {
          // This function (`page`) will get called for each page of records.
  
          all_pubs = [...all_pubs, ...pubs];
          sessionStorage.setItem("pubs", JSON.stringify(all_pubs));
  
          // To fetch the next page of records, call `fetchNextPage`.
          // If there are more records, `page` will get called again.
          // If there are no more records, `done` will get called.
          fetchNextPage();
        },
        function done(err) {
          if (err) {
            console.error(err);
            return;
          }
        }
      );
  
    // tab
    all_tab = [];
    base("the_tab")
      .select({
        // Selecting the first 3 records in Main View:
        maxRecords: 100,
        view: "Grid view",
      })
      .eachPage(
        function page(tab, fetchNextPage) {
          // This function (`page`) will get called for each page of records.
  
          all_tab = [...all_tab, ...tab];
          sessionStorage.setItem("tabs", JSON.stringify(all_tab));
  
          // To fetch the next page of records, call `fetchNextPage`.
          // If there are more records, `page` will get called again.
          // If there are no more records, `done` will get called.
          fetchNextPage();
        },
        function done(err) {
          if (err) {
            console.error(err);
            return;
          }
        }
      );
  }
  
  function cleanData() {
    let records_raw = JSON.parse(sessionStorage.getItem("records_raw"));
    let pubs = JSON.parse(sessionStorage.getItem("pubs"));
    let tabs = JSON.parse(sessionStorage.getItem("tabs"));
  
    // add publication name and combine tags
    for (r of records_raw) {
      if (r.fields.tags) {
      r.fields.topics = [...r.fields.topic, ...r.fields.tags]
      } else {
        r.fields.topics = r.fields.topic
      }
      for (p of pubs) {
        if (r.fields.pub) {
          if (r.fields.pub[0] == p.id) {
            r.fields.pub_name = p.fields.Name;
            break;
          }
        }
      }
    }
  
   tabs.forEach((t) => t.fields.topics = [t.fields.topic]) 
    
    // combine and store clean records
    records = [...records_raw, ...tabs];
    sessionStorage.setItem("records", JSON.stringify(records));
  }

// const getMetaData = require('metadata-scraper')
//const url = 'https://fivethirtyeight.com/features/the-most-diverse-cities-are-often-the-most-segregated/'


// getMetaData(url).then((data) => {
// 	console.log(data)
// })


fetchData();
cleanData();
console.log("load")

