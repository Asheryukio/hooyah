// import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.scss'
import '@/styles/index.scss'

import './directive/index.ts'


ReactDOM.createRoot(document.getElementById('root')!).render(
  <App />
  // <React.StrictMode>
  //   <App />
  // </React.StrictMode>,
)
