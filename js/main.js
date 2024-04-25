// inspo https://apps.npr.org/best-books/#view=covers&year=2023

//console.log(data)

KEY = (
    "patzYrMMVCYJOlcXE.60d2aac94cf2976072700a68b61ae1040f18b9c9da08f5ebacda2a2d4a791ee2"
)


var Airtable = require(['airtable']);
Airtable.configure({
    endpointUrl: 'https://api.airtable.com',
    apiKey: KEY
});
var base = Airtable.base('appfRI9pJ5OIOt9LV');

console.log(base)