import NautiljonExecute from "./scrappers/nautiljon/nautiljonExecute";

console.log('start scrapping !');
NautiljonExecute.initAllScrapping().then(_ => console.log('end scrapping !'));