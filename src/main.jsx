import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import CssBaseline from '@mui/material/CssBaseline'
import theme from './theme.js'
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { store } from './redux/store.js'
import { Provider } from 'react-redux'
import { ConfirmProvider } from 'material-ui-confirm'

ReactDOM.createRoot(document.getElementById('root')).render(
  // loại bỏ StrictMode để tránh in ra 2 lần clg
  // <React.StrictMode>

  <Provider store={store}>
    <CssVarsProvider theme={theme}>
      {/* ConfirmProvider được dùng để thực hiện một số chức năng liên quan đến dialog  */}
      <ConfirmProvider defaultOptions={{
        confirmationButtonProps: { variant: 'outlined' },
        allowClose: false,
        dialogProps: { maxWidth: 'xs' }
      }}>
        <CssBaseline />
        <App />
        <ToastContainer
          position="bottom-left"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme='colored'
        // theme={theme?.palette?.mode === 'dark' ? 'dark' : 'light'} // Ensure optional chaining here to avoid errors
        />
      </ConfirmProvider>

    </CssVarsProvider>
  </Provider>

  // </React.StrictMode>
)
