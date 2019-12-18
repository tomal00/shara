interface ColorTheme {
    base: string,
    light?: string,
    dark?: string,
    text: string
}

export interface Theme {
    colors: {
        primary: ColorTheme
        secondary: ColorTheme
        default?: ColorTheme
    },
    borderRadius: number
}