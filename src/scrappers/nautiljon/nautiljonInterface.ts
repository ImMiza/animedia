export interface NautiljonFilters {
    trailer: "all" | "withOnly" | "withoutOnly";
    sort: "popularity" | "startDate";
    filter: "all" | "withoutAdultContent" | "onlyAdultContent";
    kind: "all" | "series" | "movies" | "unknown";
    simulcast: "all" | "crunchyroll" | "adn" | "netflix" | "disneyplus" | "viki"
}

export interface NautiljonData {
    originalTitle: string;
    alternativeTitle: string;
    kind: string;
    amountEpisode: number;
    company: string;
    formatSource: string;
    tags: string[];
    videoUrl: string;
    description: string;
    dateStart: string;
    dateEnd: string;
    rate: number;
    simulcasts: string[];
    picture: string;
    nautiljonUrl: string;
}

export type nautiljonSeason = "été" | "automne" | "hiver" | "printemps";