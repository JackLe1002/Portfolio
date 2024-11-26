import { Platform } from 'react-native';
import { SERVER_URL_IOS, SERVER_URL_ANDROID } from '@env';

const SERVER_URL = Platform.OS === 'ios' ? SERVER_URL_IOS : SERVER_URL_ANDROID;

// don't remove - This console log fixes ios not getting url from env for me
console.log(SERVER_URL);

export const config = {
    SERVER_URL,
};
