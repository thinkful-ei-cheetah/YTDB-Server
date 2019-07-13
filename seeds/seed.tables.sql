BEGIN;

TRUNCATE
  "channel",
  "channel_keyword",
  "channel_rating",
  "channel_topic",
  "favorite",
  "keyword",
  "review",
  "review_rating",
  "topic",
  "user"
  RESTART IDENTITY CASCADE;

INSERT INTO "user" ("id", "username", "name", "password", "type")
VALUES
  (
    1,
    'admin',
    'Dunder Mifflin Admin',
    -- password = 'pass'
    '$2a$10$fCWkaGbt7ZErxaxclioLteLUgg4Q3Rp09WW0s/wSLxDKYsaGYUpjG',
    'normal'
  );

INSERT INTO "channel" ("id", "yt_id", "title", "thumbnail", "rating_total", "rating_count", "total_videos", "comment_count", "view_count", "subscriber_count", "description")
VALUES
  (1, 'UCncxKtsdgI9ruYkmYbNWh6Q', 'Trix', 'https://yt3.ggpht.com/a/AGF-l78Bd2CMucpbhI_YjodXmJWSRugVMaAk01wsIw=s88-mo-c-c0xffffffff-rj-k-no', 9, 1, 58, 0, 2974384, 25136, 'Experienced and seasoned player in the "Medieval Melee" genre. MORDHAU and other skill-based titles are the main focus of my channel.Please use my business email for business related enquiries only. If you wish to contact me for any other reason please use the email address listed below.Email: Trix.Gaming.General@gmail.comChannel art by KennyDaFinn. Check him out on Twitch: https://www.twitch.tv/kennydafinn'),
  (2, 'UCeAnD6rMvvNDvo7uG9FT-mQ', 'MORDHAU', 'https://yt3.ggpht.com/-H3iKbbDm3Hw/AAAAAAAAAAI/AAAAAAAAAAA/taFSC3nkcDo/s88-c-k-no-mo-rj-c0xffffff/photo.jpg', 0, 0, 12, 0, 2875596, 28355, 'Mordhau is an upcoming medieval first-person fighting game with a strong emphasis on skill-based competitive play. For more information visit ...'),
  (3, 'UC_mkyL75cuKExSTaMbpWrEg', 'Wilsonator', 'https://yt3.ggpht.com/-0ZFO59fUq4w/AAAAAAAAAAI/AAAAAAAAAAA/S54NXesQguE/s88-c-k-no-mo-rj-c0xffffff/photo.jpg', null, null, 501, 0, 45044581, 497327, 'just a guy playing video games member of the Yogscast.'),
  (4, 'UCHXjqDd0V98S83b_JAUL8Pw', 'Gat', 'https://yt3.ggpht.com/-uo6Ccotm8BY/AAAAAAAAAAI/AAAAAAAAAAA/z5FT2Jp9CRM/s88-c-k-no-mo-rj-c0xffffff/photo.jpg', null, null, 101, 0, 469019, 3221, 'Welcome fellow knights to my channel where most all of my content is MORDHAU! So if you are obsessed with Mordhau or medieval combat games, then this ...'),
  (5, 'UCsvn_Po0SmunchJYOWpOxMg', 'videogamedunkey', 'https://yt3.ggpht.com/-ftMaOzF43WA/AAAAAAAAAAI/AAAAAAAAAAA/rks3UOR9mGc/s88-c-k-no-mo-rj-c0xffffff/photo.jpg', null, null, 640, 0, 2125832588, 5593976, 'watch my stupid ass videos.');
  -- id SERIAL PRIMARY KEY,
  -- yt_id TEXT NOT NULL UNIQUE,
  -- title TEXT NOT NULL UNIQUE,
  -- thumbnail TEXT,
  -- rating_total INTEGER DEFAULT NULL,
  -- rating_count INTEGER DEFAULT NULL
  -- ADD COLUMN 'total-videos' INTEGER,
  -- ADD COLUMN 'comment-count' INTEGER,
  -- ADD COLUMN 'view-count' INTEGER,
  -- ADD COLUMN 'subscriber-count' INTEGER,
  -- ADD COLUMN 'description' TEXT,
  -- ADD COLUMN 'date_updated' TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL;

INSERT INTO "keyword" ("id", "title")
VALUES
  (1, 'mordhau'),
  (2, 'alpha'),
  (3, 'beta'),
  (4, 'pre-release'),
  (5, 'early-access'),
  (6, 'melee'),
  (7, 'multiplayer'),
  (8, 'slasher'),
  (9, 'chivalry'),
  (10, 'medieval'),
  (11, 'knight'),
  (12, 'warrior'),
  (13, 'battle'),
  (14, 'fight'),
  (15, 'fighting'),
  (16, 'skill'),
  (17, 'competitive'),
  (18, 'gaming'),
  (19, 'pc'),
  (20, 'first-person'),
  (21, 'fps'),
  (22, 'dunkey'),
  (23, 'videogamedunkey'),
  (24, 'vgdunkey');

INSERT INTO "channel_keyword" ("channel_id", "keyword_id")
VALUES
  (1, 1),
  (1, 2),
  (1, 3),
  (1, 4),
  (1, 5),
  (1, 6),
  (1, 7),
  (1, 8),
  (1, 9),
  (1, 10),
  (1, 11),
  (1, 12),
  (1, 13),
  (1, 14),
  (1, 15),
  (1, 16),
  (1, 17),
  (1, 18),
  (1, 19),
  (1, 20),
  (1, 21),
  (2, 1),
  (3, 18),
  (4, 1),
  (4, 10),
  (4, 18),
  (5, 22),
  (5, 23),
  (5, 24);
  -- channel_id INTEGER REFERENCES channel(id) ON DELETE CASCADE NOT NULL,
  -- keyword_id INTEGER REFERENCES keyword(id) ON DELETE CASCADE NOT NULL,
  -- CONSTRAINT channel_keyword_key PRIMARY KEY (channel_id, keyword_id)
INSERT INTO "channel_rating" ("user_id", "channel_id", "rating")
VALUES
  (1, 1, 9);
  -- 'user_id' INTEGER REFERENCES 'user'(id) ON DELETE CASCADE NOT NULL,
  -- 'channel_id' INTEGER REFERENCES channel(id) ON DELETE CASCADE NOT NULL,
  -- CONSTRAINT channel_rating_key PRIMARY KEY ('user_id' , 'channel_id'),
  -- rating INTEGER NOT NULL,
  -- CHECK (rating BETWEEN 0 AND 10)
INSERT INTO "topic" ("id", "titleId", "title")
VALUES
  (1, '/m/04rlf', 'Music'),
  (2, '/m/02mscn', 'Christian music'),
  (3, '/m/0ggq0m', 'Classical music'),
  (4, '/m/01lyv', 'Country music'),
  (5, '/m/02lkt', 'Electronic music'),
  (6, '/m/0glt670', 'Hip hop music'),
  (7, '/m/05rwpb', 'Independent music'),
  (8, '/m/03_d0', 'Jazz'),
  (9, '/m/028sqc', 'Music of Asia'),
  (10, '/m/0g293', 'Music of Latin America'),
  (11, '/m/064t9', 'Pop music'),
  (12, '/m/06cqb', 'Reggae'),
  (13, '/m/06j6l', 'Rhythm and blues'),
  (14, '/m/06by7', 'Rock music'),
  (15, '/m/0gywn', 'Soul music'),
  (16, '/m/0bzvm2', 'Gaming'),
  (17, '/m/025zzc', 'Action game'),
  (18, '/m/02ntfj', 'Action-adventure game'),
  (19, '/m/0b1vjn', 'Casual game'),
  (20, '/m/02hygl', 'Music video game'),
  (21, '/m/04q1x3q', 'Puzzle video game'),
  (22, '/m/01sjng', 'Racing video game'),
  (23, '/m/0403l3g', 'Role-playing video game'),
  (24, '/m/021bp2', 'Simulation video game'),
  (25, '/m/022dc6', 'Sports game'),
  (26, '/m/03hf_rm', 'Strategy video game'),
  (27, '/m/06ntj', 'Sports'),
  (28, '/m/0jm_', 'American football'),
  (29, '/m/018jz', 'Baseball'),
  (30, '/m/018w8', 'Basketball'),
  (31, '/m/01cgz', 'Boxing'),
  (32, '/m/09xp_', 'Cricket'),
  (33, '/m/02vx4', 'Football'),
  (34, '/m/037hz', 'Golf'),
  (35, '/m/03tmr', 'Ice hockey'),
  (36, '/m/01h7lh', 'Mixed martial arts'),
  (37, '/m/0410tth', 'Motorsport'),
  (38, '/m/07bs0', 'Tennis'),
  (39, '/m/07_53', 'Volleyball'),
  (40, '/m/02jjt', 'Entertainment'),
  (41, '/m/09kqc', 'Humor'),
  (42, '/m/02vxn', 'Movies'),
  (43, '/m/05qjc', 'Performing arts'),
  (44, '/m/066wd', 'Professional wrestling'),
  (45, '/m/0f2f9', 'TV shows'),
  (46, '/m/019_rr', 'Lifestyle'),
  (47, '/m/032tl', 'Fashion'),
  (48, '/m/027x7n', 'Fitness'),
  (49, '/m/02wbm', 'Food'),
  (50, '/m/03glg', 'Hobby'),
  (51, '/m/068hy', 'Pets'),
  (52, '/m/041xxh', 'Physical attractiveness'),
  (53, '/m/07c1v', 'Technology'),
  (54, '/m/07bxq', 'Tourism'),
  (55, '/m/07yv9', 'Vehicles'),
  (56, '/m/098wr', 'Society'),
  (57, '/m/09s1f', 'Business'),
  (58, '/m/0kt51', 'Health'),
  (59, '/m/01h6rj', 'Military'),
  (60, '/m/05qt0', 'Politics'),
  (61, '/m/06bvp', 'Religion'),
  (62, '/m/01k8wb', 'Knowledge');

INSERT INTO "channel_topic" ("channel_id", "topic_id")
VALUES
  (1, 23),
  (1, 16),
  (1, 17),
  (2, 16),
  (2, 17),
  (2, 23),
  (3, 16),
  (3, 17),
  (3, 23),
  (4, 16),
  (4, 17),
  (4, 23),
  (5, 16),
  (5, 17),
  (5, 23);
  -- channel_id INTEGER REFERENCES channel(id) ON DELETE CASCADE NOT NULL,
  -- topic_id INTEGER REFERENCES topic(id) ON DELETE CASCADE NOT NULL,
  -- CONSTRAINT channel_topic_key PRIMARY KEY (channel_id, topic_id)
INSERT INTO "favorite" ("user_id", "channel_id")
VALUES
  (1, 1);
  -- 'user_id' INTEGER REFERENCES 'user'(id) ON DELETE CASCADE NOT NULL,
  -- 'channel_id' INTEGER REFERENCES channel(id) ON DELETE CASCADE NOT NULL,
  -- CONSTRAINT favorite_key PRIMARY KEY ('user_id' , 'channel_id'),
  -- 'date_created' TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
INSERT INTO "review" ("id", "user_id", "channel_id", "text", "total_likes", "total_dislikes")
VALUES
  (1, 1, 1, 'USER 1 (admin) made a review for CHANNEL 1 (Trix)', 1, 0);
  -- 'id' SERIAL PRIMARY KEY,
  -- 'user_id' INTEGER REFERENCES 'user'(id) ON DELETE CASCADE NOT NULL,
  -- 'channel_id' INTEGER REFERENCES channel(id) ON DELETE CASCADE NOT NULL,
  -- 'text' TEXT NOT NULL,
  -- 'total_likes' INTEGER,
  -- 'total_dislikes' INTEGER,
  -- 'date_created' TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  -- 'date_updated' TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
INSERT INTO "review_rating" ("user_id", "review_id", "like")
VALUES
  (1, 1, TRUE);
  -- 'user_id' INTEGER REFERENCES 'user'(id) ON DELETE CASCADE NOT NULL,
  -- 'review_id' INTEGER REFERENCES 'review'(id) ON DELETE CASCADE NOT NULL,
  -- CONSTRAINT review_rating_key PRIMARY KEY ('user_id', 'review_id'),
  -- 'like' BOOL NOT NULL

SELECT pg_catalog.setval(pg_get_serial_sequence('channel', 'id'), MAX(id)) FROM channel;
SELECT pg_catalog.setval(pg_get_serial_sequence('keyword', 'id'), MAX(id)) FROM keyword;
SELECT pg_catalog.setval(pg_get_serial_sequence('review', 'id'), MAX(id)) FROM review;
SELECT pg_catalog.setval(pg_get_serial_sequence('topic', 'id'), MAX(id)) FROM topic;
-- SELECT pg_catalog.setval(pg_get_serial_sequence('user', 'id'), MAX(id)) FROM user;

COMMIT;