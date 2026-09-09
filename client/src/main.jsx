import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, createRoutesFromElements, Navigate, Route, RouterProvider } from 'react-router-dom'
import AuthLayout from './Layouts/auth.jsx'
import SignUp from './Pages/Auth/SignUp.jsx'
import Login from './Pages/Auth/Login.jsx'


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<AuthLayout />}>
      {/* MAKING ROOT ELEMENT SIGNUP */}
      <Route index element={<Navigate to={"/signup"} replace />} />
      <Route path='signup' element={<SignUp />} />
      {/* FALLBACK FOR INVALID URLS */}
      <Route path='*' element={<div>Page not found</div>} />
      <Route path='login' element={<Login />} />
    </Route>
  )
)

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)