import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { CssBaseline, ThemeProvider } from '@mui/material'
import App from './App.jsx'
import theme from './theme.js'
import { HistoryProvider } from './contexts/HistoryContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <HistoryProvider>
          <App />
        </HistoryProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
)