CREATE TABLE IF NOT EXISTS users(
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(255) NOT NULL,
    reset_token VARCHAR(255),
    reset_token_expiry TIMESTAMP,
    password VARCHAR(255) NOT NUll,
    package VARCHAR(50) NOT NULL DEFAULT 'free', -- Added package type
    storage_used BIGINT DEFAULT 0,
    storage_limit BIGINT DEFAULT 2097152 -- 2MB in bytes (5 * 1024 * 1024)
);

CREATE TABLE IF NOT EXISTS refresh_tokens (
    refresh_token_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    refresh_token_value VARCHAR(255) NOT NULL,
    expired_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    revoked BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS files (
    file_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_size BIGINT NOT NULL,
    s3_object_key VARCHAR(1024) UNIQUE NOT NULL,
    content_type VARCHAR(255) NOT NULL,
    uploaded_with_package VARCHAR(50) NOT NULL, -- Added package type at upload
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_refresh_token_value ON refresh_tokens(refresh_token_value);
CREATE INDEX idx_files_user_id ON files(user_id);
CREATE INDEX idx_files_s3_object_key ON files(s3_object_key);