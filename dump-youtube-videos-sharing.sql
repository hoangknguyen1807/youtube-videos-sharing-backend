--
-- PostgreSQL database dump
--

-- Dumped from database version 13.3
-- Dumped by pg_dump version 13.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Authentication; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Authentication" (
    id character varying DEFAULT public.uuid_generate_v4() NOT NULL,
    token character varying NOT NULL,
    "userId" character varying,
    "expireAt" timestamp without time zone,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "deletedAt" timestamp without time zone
);


ALTER TABLE public."Authentication" OWNER TO postgres;

--
-- Name: User; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User" (
    id character varying DEFAULT public.uuid_generate_v4() NOT NULL,
    email character varying NOT NULL,
    password character varying,
    "refreshToken" character varying,
    "lastLoginAt" timestamp without time zone,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "deletedAt" timestamp without time zone
);


ALTER TABLE public."User" OWNER TO postgres;

--
-- Name: YouTubeVideo; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."YouTubeVideo" (
    id character varying DEFAULT public.uuid_generate_v4() NOT NULL,
    "userId" character varying NOT NULL,
    title character varying NOT NULL,
    description character varying NOT NULL,
    url character varying NOT NULL,
    "thumbnailUrl" character varying NOT NULL,
    status character varying NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "deletedAt" timestamp without time zone
);


ALTER TABLE public."YouTubeVideo" OWNER TO postgres;

--
-- Name: migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.migrations (
    id integer NOT NULL,
    "timestamp" bigint NOT NULL,
    name character varying NOT NULL
);


ALTER TABLE public.migrations OWNER TO postgres;

--
-- Name: migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.migrations_id_seq OWNER TO postgres;

--
-- Name: migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.migrations_id_seq OWNED BY public.migrations.id;


--
-- Name: typeorm_metadata; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.typeorm_metadata (
    type character varying NOT NULL,
    database character varying,
    schema character varying,
    "table" character varying,
    name character varying,
    value text
);


ALTER TABLE public.typeorm_metadata OWNER TO postgres;

--
-- Name: migrations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.migrations ALTER COLUMN id SET DEFAULT nextval('public.migrations_id_seq'::regclass);


--
-- Data for Name: Authentication; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Authentication" (id, token, "userId", "expireAt", "createdAt", "updatedAt", "deletedAt") FROM stdin;
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."User" (id, email, password, "refreshToken", "lastLoginAt", "createdAt", "updatedAt", "deletedAt") FROM stdin;
c8aac011-d601-45b5-9615-8e3674c97759	usera@mailnesia.com	$2b$10$JQj1UMz6Tp9ZXMOf.ZIkWecDy3ZYPj89IVor0A7V1vHLqZ41nlwna	\N	2023-06-15 08:37:00.192	2023-06-15 15:36:57.340765	2023-06-15 15:37:00.194791	\N
df705d5d-b80e-4305-b937-88255ee5443e	userb@mailnesia.com	$2b$10$TKia8p4A.FQfNssBGjiv/.2VhyJFzYdh62s526GVWMEbs4qu7OXPa	\N	2023-06-15 11:18:12.974	2023-06-15 16:21:38.610495	2023-06-15 18:18:12.977191	\N
\.


--
-- Data for Name: YouTubeVideo; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."YouTubeVideo" (id, "userId", title, description, url, "thumbnailUrl", status, "createdAt", "updatedAt", "deletedAt") FROM stdin;
841de782-151b-46ab-9311-7e8ce4999aea	c8aac011-d601-45b5-9615-8e3674c97759	Block.one: Creating a Multi Node EOSIO Blockchain || [GSP991] || Solution	Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...	https://www.youtube.com/watch?v=y9T2odcfpC4	https://i.ytimg.com/vi/y9T2odcfpC4/hqdefault.jpg	ACTIVE	2023-06-15 15:43:40.143442	2023-06-15 15:43:40.143442	\N
3686a872-f2bf-4d0e-8c9a-420fa4e0f0ca	c8aac011-d601-45b5-9615-8e3674c97759	Apple’s Universal Control vs Sidecar Explained	Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...	https://www.youtube.com/watch?v=g6jzjHPsR30	https://i.ytimg.com/vi/g6jzjHPsR30/hqdefault.jpg	ACTIVE	2023-06-15 16:06:54.354894	2023-06-15 16:06:54.354894	\N
f88e3025-1431-42a0-9f1f-a697fd584287	df705d5d-b80e-4305-b937-88255ee5443e	Back-Hand (BHE) and Front-Hand English (FHE) - from "How To Aim Pool Shots (HAPS)" - NV E.2	Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...	https://www.youtube.com/watch?v=6qXJoFOLZZE&t=240s	https://i.ytimg.com/vi/6qXJoFOLZZE/hqdefault.jpg	ACTIVE	2023-06-15 16:35:59.032818	2023-06-15 16:35:59.032818	\N
dd698612-986c-443c-82a0-282a8b8971e6	df705d5d-b80e-4305-b937-88255ee5443e	Andrew Tate First Emergency Meeting After Jail Release	Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...	https://www.youtube.com/watch?v=ZDKg6eVpY7k	https://i.ytimg.com/vi/ZDKg6eVpY7k/hqdefault.jpg	ACTIVE	2023-06-15 16:40:11.415141	2023-06-15 16:40:11.415141	\N
5376e0a5-fa39-403a-86f8-07372e824426	df705d5d-b80e-4305-b937-88255ee5443e	Andrew Tate vs Piers Morgan | The Full Interview	Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...	https://www.youtube.com/watch?v=VGWGcESPltM	https://i.ytimg.com/vi/VGWGcESPltM/hqdefault.jpg	ACTIVE	2023-06-15 18:22:48.140612	2023-06-15 18:22:48.140612	\N
5db2f34c-5a30-4592-a901-f31c68db4ff4	df705d5d-b80e-4305-b937-88255ee5443e	Andrew Tate FINALLY HAPPY Leaving Court	Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...	https://www.youtube.com/watch?v=RJ1_baClvSM	https://i.ytimg.com/vi/RJ1_baClvSM/hqdefault.jpg	ACTIVE	2023-06-15 18:25:03.073328	2023-06-15 18:25:03.073328	\N
b1d70338-7a38-492d-9d98-2108f6950680	df705d5d-b80e-4305-b937-88255ee5443e	Impossible Cristiano Ronaldo Moments	Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...	https://www.youtube.com/watch?v=fJLrfALZGmE	https://i.ytimg.com/vi/fJLrfALZGmE/hqdefault.jpg	ACTIVE	2023-06-15 18:27:40.714883	2023-06-15 18:27:40.714883	\N
3f770974-cb1e-4b11-8166-21456fe5af7d	df705d5d-b80e-4305-b937-88255ee5443e	10 Legendary Moments by Cristiano Ronaldo for Manchester United	Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...	https://www.youtube.com/watch?v=hm45fKy8srI	https://i.ytimg.com/vi/hm45fKy8srI/hqdefault.jpg	ACTIVE	2023-06-15 18:31:11.713482	2023-06-15 18:31:11.713482	\N
bac042a0-562a-4746-bd3f-d16f6755eac2	df705d5d-b80e-4305-b937-88255ee5443e	Al Nassr vs Al Ittihad 3-1 All Goals & Highlights 2023 | Benzema and Ronaldo on fire	Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...	https://www.youtube.com/watch?v=SgaPhadWDeo	https://i.ytimg.com/vi/SgaPhadWDeo/hqdefault.jpg	ACTIVE	2023-06-15 18:37:48.358514	2023-06-15 18:37:48.358514	\N
f5afc8a3-b0b5-4c25-89df-b6f75bbcfe5e	c8aac011-d601-45b5-9615-8e3674c97759	Lionel Messi The Most Smart & Creative Plays	Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...	https://www.youtube.com/watch?v=twOMe6o1eLU	https://i.ytimg.com/vi/twOMe6o1eLU/hqdefault.jpg	ACTIVE	2023-06-15 18:48:39.575103	2023-06-15 18:48:39.575103	\N
2d8d2f05-1295-4599-9581-bbe1edb1c966	df705d5d-b80e-4305-b937-88255ee5443e	Lionel Messi ● 20 LEGENDARY Solo Goals Won't Repeat in 1000 Years ||HD||	Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...	https://www.youtube.com/watch?v=tHDf60BNI_c	https://i.ytimg.com/vi/tHDf60BNI_c/hqdefault.jpg	ACTIVE	2023-06-15 19:03:24.769153	2023-06-15 19:03:24.769153	\N
\.


--
-- Data for Name: migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.migrations (id, "timestamp", name) FROM stdin;
1	1677143444403	CreateUserTable1677143444403
2	1677202326445	CreateAuthTable1677202326445
3	1677318805858	CreateYouTubeVideoTable1677318805858
\.


--
-- Data for Name: typeorm_metadata; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.typeorm_metadata (type, database, schema, "table", name, value) FROM stdin;
\.


--
-- Name: migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.migrations_id_seq', 3, true);


--
-- Name: migrations PK_8c82d7f526340ab734260ea46be; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.migrations
    ADD CONSTRAINT "PK_8c82d7f526340ab734260ea46be" PRIMARY KEY (id);


--
-- Name: User PK_9862f679340fb2388436a5ab3e4; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "PK_9862f679340fb2388436a5ab3e4" PRIMARY KEY (id);


--
-- Name: YouTubeVideo PK_9e640cbddc094a95578ebb7c4da; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."YouTubeVideo"
    ADD CONSTRAINT "PK_9e640cbddc094a95578ebb7c4da" PRIMARY KEY (id);


--
-- Name: Authentication PK_e69ed6b26bbd660bebdfa4a8127; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Authentication"
    ADD CONSTRAINT "PK_e69ed6b26bbd660bebdfa4a8127" PRIMARY KEY (id);


--
-- Name: User UQ_4a257d2c9837248d70640b3e36e; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "UQ_4a257d2c9837248d70640b3e36e" UNIQUE (email);


--
-- Name: Authentication UQ_8ffe3e6e0e6bf020d47b42aa98a; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Authentication"
    ADD CONSTRAINT "UQ_8ffe3e6e0e6bf020d47b42aa98a" UNIQUE (token);


--
-- Name: Authentication FK_b7bdc4f5868aa2c0c3cf5c4a168; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Authentication"
    ADD CONSTRAINT "FK_b7bdc4f5868aa2c0c3cf5c4a168" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON DELETE CASCADE;


--
-- Name: YouTubeVideo FK_f20ef966c0ff4b26df6dc4054ab; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."YouTubeVideo"
    ADD CONSTRAINT "FK_f20ef966c0ff4b26df6dc4054ab" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

