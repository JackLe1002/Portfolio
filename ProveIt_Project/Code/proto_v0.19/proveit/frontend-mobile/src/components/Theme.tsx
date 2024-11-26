import { Dimensions } from "react-native";

const { width, height } = Dimensions.get('window');

export const COLOURS = {
    blue: '#194185',
    grey: '#D9D9D9',
};

export const SIZES = {
    h1: 20,
    h2: 18,
    h3: 16,
    p: 14,

    width,
    height,
}

export const FONTWEIGHT = {
    bold: 'bold',
    normal: 'normal',
    weight500: '500',
    weight700: '700',
}