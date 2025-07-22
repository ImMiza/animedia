import NautiljonScrapper from "./scrappers/nautiljon/nautiljonScrapper";

new NautiljonScrapper().getPageData("été", 2024).then(value => console.log(value));