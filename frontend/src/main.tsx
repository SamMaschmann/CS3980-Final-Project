import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import './index.css'
import ErrorPage from './routes/error_page.tsx'
import Root from './routes/root/root.tsx'
import Transactions from './routes/transactions/transactions.tsx'
import Budget from './routes/budget/budget.tsx'
import Friends from './routes/friends/friends.tsx'
import Calender from './routes/calender/calender.tsx'
import Loans from './routes/loans/loans.tsx'
import Requests from './routes/requests/requests.tsx'
import Dashboard from './routes/dashboard/dashboard.tsx'


const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Dashboard />
      },
      {
        path: "transactions",
        element: <Transactions />
      },
      {
        path: "budget",
        element: <Budget />
      },
      {
        path: "friends",
        element: <Friends />
      },
      {
        path: "calender",
        element: <Calender />
      },
      {
        path: "loans",
        element: <Loans />
      },
      {
        path: "requests",
        element: <Requests />
      }
    ]
  }
])




ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
