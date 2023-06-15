import crypto from 'crypto';
import { isString } from 'lodash';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { isUUID } from '@nestjs/common/utils/is-uuid';

export function makeAToken() {
    return crypto.createHash('md5').update(randomStringGenerator()).digest('hex');
}

export function replaceSpace(value: string) {
    return value.replace(/\s+/g, '');
}

export function isUuidV4(value: string): boolean {
    return isString(value) && value.length && isUUID(value, '4');
}

export function convertStringFullTextSearch(keyWord: string): string {
    return keyWord
        .split(' ')
        .filter((el) => el)
        .map((item) => `${item}:*`)
        .join(' & ');
}

export function buildTsVector(fields: string[]) {
    return fields.join(` || ' ' || `);
}

export function replaceSpecialCharactersIfExist(text: string, specialCharacters: RegExp = /[`!&()':|<]/): string {
    if (specialCharacters.test(text)) {
        return '';
    }
    return text;
}
