create table animes_nautiljon
(
    id                uuid      default uuid_generate_v4() not null
        constraint anime_pkey
            primary key,
    original_title    varchar(256)                         not null
        constraint anime_original_title_key
            unique,
    alternative_title varchar(256),
    video_url         varchar(256),
    description       text                                 not null,
    picture           varchar(512)                         not null,
    kind              varchar(64)                          not null,
    amount_episode    integer,
    company           varchar(32),
    format_source     varchar(32),
    date_start        date,
    date_end          date,
    rate              double precision,
    nautiljon_url     varchar(512)                         not null
        constraint anime_nautiljon_url_key
            unique,
    tags              jsonb                                not null,
    simulcasts        jsonb                                not null,
    created_at        timestamp default CURRENT_TIMESTAMP  not null
);