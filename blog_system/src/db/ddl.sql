CREATE TABLE users
(
    id          INTEGER                            NOT NULL UNIQUE,
    email       VARCHAR                            NOT NULL UNIQUE,
    login       VARCHAR                            NOT NULL UNIQUE,
    password    VARCHAR                            NOT NULL,
    "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    PRIMARY KEY (id)
);


CREATE TABLE posts
(
    id          INTEGER                            NOT NULL UNIQUE,
    "authorId"  INTEGER                            NOT NULL,
    title       VARCHAR                            NOT NULL,
    content     VARCHAR                            NOT NULL,
    "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY ("authorId") REFERENCES users (id)
);


CREATE TABLE categories
(
    id          INTEGER                            NOT NULL,
    title       VARCHAR                            NOT NULL UNIQUE,
    "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    PRIMARY KEY (id)
);


CREATE TABLE comments
(
    id          INTEGER                            NOT NULL UNIQUE,
    "authorId"  INTEGER                            NOT NULL,
    "postId"    INTEGER                            NOT NULL,
    content     TEXT                               NOT NULL,
    "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY ("authorId") REFERENCES users (id),
    FOREIGN KEY ("postId") REFERENCES posts (id)
);


CREATE TABLE post_to_category
(
    "categoryId" INTEGER NOT NULL,
    "postId"     INTEGER NOT NULL,
    FOREIGN KEY ("categoryId") REFERENCES categories (id),
    FOREIGN KEY ("postId") REFERENCES posts (id),
    CONSTRAINT pk_post_to_category PRIMARY KEY (categoryId, postId)
);


CREATE TABLE saved_posts
(
    id          INTEGER                            NOT NULL UNIQUE,
    "userId"    INTEGER                            NOT NULL,
    "postId"    INTEGER                            NOT NULL,
    "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY ("userId") REFERENCES users (id),
    FOREIGN KEY ("postId") REFERENCES posts (id)
);


CREATE TABLE SUBSCRIBES
(
    id             INTEGER                            NOT NULL UNIQUE,
    "authorId"     INTEGER                            NOT NULL,
    "subscriberId" INTEGER                            NOT NULL,
    "createdAt"    DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt"    DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY ("authorId") REFERENCES users (id),
    FOREIGN KEY ("subscriberId") REFERENCES users (id)
);