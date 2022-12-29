export const red = '#C30525';
export const disabledColor = '#CCCCCC';
export const pageColor = '#FFFFFF';
export const pageBackgroundColor = '#F2F2F2';

export enum ButtonTheme {
    promoted,
    danger,
    subtle
}


export const theme = {
    [ButtonTheme.promoted]: '#016CBB',
    [ButtonTheme.danger]: '#C30525',
    [ButtonTheme.subtle]: disabledColor,
}