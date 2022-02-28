export const DarkTheme = {
  background: "#23262d",
  backgtroundDark: "#1c1f26",
  text: "#f4f4f5",
  accent: "#198ce5",
  accentGrad: "linear-gradient(125deg, #198ce5 0%, #2a7ab8 100%)",
  redGrad: "linear-gradient(125deg, #c12449 0%, #96253f 100%)",

  info: "#2483c1",
  warning: "#c17824",
  success: "#27a56d",
  error: "#c12449",

  gray: "#595959",
  online: "#24d87e",
  offline: "#d82457",
};

export const DefaultTheme = DarkTheme;
export type Theme = typeof DefaultTheme;
