import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, createRoutesFromElements, Navigate, Route, RouterProvider } from 'react-router-dom'
import AuthLayout from './Layouts/auth.jsx'
import DashboardLayout from './Layouts/dashboard.jsx'
import SignUp from './Pages/Auth/SignUp.jsx'
import Login from './Pages/Auth/Login.jsx'
import Dashboard from './Pages/Dashboard/Dashboard.jsx'
import Landing from './Pages/Landing/Landing.jsx'


const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path='/dashboard/' element={<DashboardLayout />}>
        <Route path='' element={<Dashboard />} />
      </Route>
      <Route path='/' element={<AuthLayout />}>
        {/* MAKING ROOT ELEMENT SIGNUP */}
        {/* <Route index element={<Navigate to={"/signup"} replace />} /> */}
        <Route path='' element={<Landing />} />
        <Route path='signup' element={<SignUp />} />
        <Route path='login' element={<Login />} />
        {/* FALLBACK FOR INVALID URLS */}
        <Route path='*' element={<div>Page not found</div>} />
      </Route>
    </>
  )
)

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)