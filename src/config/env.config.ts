import dotenv from 'dotenv';

let isTest = process.env.NODE_ENV === 'test';
dotenv.config();

export const env = {
    APP_PORT: process.env.APP_PORT,
    APP_ENV: process.env.APP_ENV,
    APP_KEY: process.env.APP_KEY,
    BACKEND_URL: process.env.BACKEND_URL,
    WEB_URL: process.env.WEB_URL,
    JWT: {
        SECRET: process.env.JWT_SECRET,
        EXPIRE: process.env.JWT_EXPIRE || '1d',
        REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
        REFRESH_EXPIRE: process.env.JWT_REFRESH_EXPIRE || '7d'
    },
    THROTTLE: {
        TTL: Number(process.env.THROTTLE_TTL || 60),
        LIMIT: Number(process.env.THROTTLE_LIMIT || 60)
    },
    SALT_ROUND: 10,
    ROOT_PATH: process.cwd() + (isTest ? '/src' : ''),
    DATABASE: {
        CONNECT: process.env.DATABASE_CONNECT as any,
        HOST: process.env.DATABASE_HOST,
        PORT: Number(process.env.DATABASE_PORT),
        USER: process.env.DATABASE_USER,
        PASSWORD: process.env.DATABASE_PASSWORD,
        NAME: process.env.DATABASE_NAME
    },
    REDIS: {
        HOST: process.env.REDIS_HOST,
        PORT: Number(process.env.REDIS_PORT || 6379),
        USER: process.env.REDIS_USER,
        PASS: process.env.REDIS_PASS
    },
    FORGOT_PASSWORD_TTL: Number(process.env.FORGOT_PASSWORD_TTL || 15),
    WHITELIST_DOMAINS: (process.env.WHITELIST_DOMAINS || 'localhost').split(','),
    FILE_LIMIT: {
        ASSESSMENT_DOCUMENT: Number(process.env.FILE_LIMIT_ASSESSMENT_DOCUMENT) || 5
    },
    AZURE: {
        ACCOUNT_NAME: process.env.AZURE_ACCOUNT_NAME,
        ACCOUNT_KEY: process.env.AZURE_ACCOUNT_KEY,
        CONTAINER_NAME: process.env.AZURE_CONTAINER_NAME || 'files',
        BLOB_CONTAINER: process.env.AZURE_BLOB_CONTAINER || 'files',
        SAS_EXPIRED_IN: Number(process.env.AZURE_SAS_EXPIRED_IN) || 3600,
        CONTAINER_LEVEL: process.env.AZURE_CONTAINER_LEVEL
    }
};
