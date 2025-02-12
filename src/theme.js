import { red } from '@mui/material/colors'
import { experimental_extendTheme as extendTheme } from '@mui/material/styles'


const APP_BAR_HEIGHT = '58px'
const APP_BOARD_HEIGHT = '60px'
const BOARD_CONTENT_HEIGHT = `calc(100vh - ${APP_BAR_HEIGHT} - ${APP_BOARD_HEIGHT})`
const COLUMN_HEADER_HEIGHT = '58px'
const COLUMN_FOOTER_HEIGHT = '90px'
// Create a theme instance.
const theme = extendTheme({
  trelloCumtom: {
    appBarHeight: APP_BAR_HEIGHT,
    appBoardHeight: APP_BOARD_HEIGHT,
    boardContentHeight: BOARD_CONTENT_HEIGHT,
    columnHeaderHeight: COLUMN_HEADER_HEIGHT,
    columnFooterHeight: COLUMN_FOOTER_HEIGHT
  },
  colorSchemes: {
    light: { // palette for light mode
      palette: {
        primary: {
          main: '#fff',
          light: '#52b788',
          dark: '#FFC0CB',
          pink: '#9377a6',
          bg: ' #F7418F',
          specialColor: '#E52B50',
          container: '#f8edeb',
          Boxcolumn: '#fdc4e79b',
          bntcolor: '#082010',
          contrastText: '#f6538e'
        },
        secondary: {
          main: '#f50057'
        },
        error: {
          main: red.A400
        }
      }
    },
    dark: { // palette for dark mode
      palette: {
        primary: {
          light: '#40916c',
          dark: '#1F305E',
          main: '#EEEEEE',
          specialColor: '#E52B50',
          container: '#111111',
          Boxcolumn: '#43474b45',
          bntcolor: '#5c97f7',
          bg: '#04395e',
          contrastText: '#fff'
        },
        secondary: {
          main: '#D71868'
        },
        error: {
          main: red.A400
        }
      }
    }
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          '*::-webkit-scrollbar': {
            width: '8px',
            height: '8px'
          },
          '*::-webkit-scrollbar-thumb': {
            backgroundColor: '#B3C8CF',
            borderRadius: '8px'
          },
          '*::-webkit-scrollbar-thumb:hover': {
            backgroundColor: '#948979',
            borderRadius: '8px'
          }
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: ({ theme }) => ({
          textTransform: 'none',
          backgroundColor: theme.palette.primary.bg,
          '&:hover': {
            backgroundColor: theme.palette.primary.specialColor
          }
        })
      }
    },
    MuiInputLabel: {
      styleOverrides: {
        root: ({ theme }) => ({
          color: theme.palette.primary.main,
          fontSize: '0.875rem'
        })
      }
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          '&.MuiTypography-body1': {
            fontSize: '0.875rem'
          }

        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: ({ theme }) => ({
          color: theme.palette.primary.main,
          fontSize: '0.875rem',
          '.MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.primary.main
          },
          '&:hover': {
            '.MuiOutlinedInput-notchedOutline': {
              borderColor: theme.palette.primary.main
            }
          },
          '& fieldset': {
            borderWidth: '0.5px !important'
          },
          '&:hover fieldset': {
            borderWidth: '1px !important'
          }

        })
      }
    }
  }
})

export default theme