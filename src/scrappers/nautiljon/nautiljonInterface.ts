export interface NautiljonFilters {
    trailer: "all" | "withOnly" | "withoutOnly";
    sort: "popularity" | "startDate";
    filter: "all" | "withoutAdultContent" | "onlyAdultContent";
    kind: "all" | "series" | "movies" | "unknown";
    simulcast: "all" | "crunchyroll" | "adn" | "netflix" | "disneyplus" | "viki"
}

export interface NautiljonData {

}

export type nautiljonSeason = "été" | "automne" | "hiver" | "printemps";