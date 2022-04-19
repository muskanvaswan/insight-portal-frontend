import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';
import "@fontsource/nunito-sans";

// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      main: '#556cd6',
    },
    secondary: {
      main: '#19857b',
    },
    error: {
      main: red.A400,
    },
  },
  typography: {
    fontFamily: 'Nunito Sans'
  }
});

export default theme;
