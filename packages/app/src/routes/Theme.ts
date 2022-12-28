export const blue = '#016CBB';
export const purple = '#8D86CE';
export const green = '#04B250';
export const lightGreen = '#05E868';
export const red = '#C30525';
export const lightRed = '#E3062B';
export const grey = '#CCC';
export const yellow = '#E3CE06';
export const darkYellow = '#DEB02E';
export const white = 'rgba(255,255,255,1)';
export const veryLightRed = '#FAD0CC';
export const veryLightBlue = '#DEF0FC';

export enum ButtonTheme {
    promoted,
    danger,
    subtle
}


export const theme = {
    [ButtonTheme.promoted]: blue,
    [ButtonTheme.danger]: red,
    [ButtonTheme.subtle]: grey,
}