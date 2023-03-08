CREATE TABLE posts (
    link TEXT NOT NULL,
    message TEXT,
    user_id INT NOT NULL,
    created_at TIMESTAMP without time zone NOT NULL default now()
);