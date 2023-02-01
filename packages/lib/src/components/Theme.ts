export const red = '#C30525';
export const disabledColor = '#CCCCCC';
export const pageColor = '#FFFFFF';
export const pageBackgroundColor = '#F2F2F2';
export const blue = "#058CC3";

export enum ButtonTheme {
    promoted,
    danger,
    subtle,
    normal
}


export const theme = {
    [ButtonTheme.promoted]: blue,
    [ButtonTheme.danger]: red,
    [ButtonTheme.subtle]: disabledColor,
    [ButtonTheme.normal]: '#555'
}