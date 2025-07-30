import NautiljonExecute from "../scrappers/nautiljon/nautiljonExecute";
import VoirAnimeExecute from "../scrappers/voiranime/voirAnimeExecute";

console.log('start scrapping !');
VoirAnimeExecute.initAllScrapping().then(_ => console.log('end scrapping !'));