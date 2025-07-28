import NautiljonExecute from "../scrappers/nautiljon/nautiljonExecute";

console.log('start scrapping !');
NautiljonExecute.updateScrapping().then(_ => console.log('end scrapping !'));