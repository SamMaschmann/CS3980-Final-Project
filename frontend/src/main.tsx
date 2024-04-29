import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { store } from './store/store';
import { Provider } from 'react-redux';
import "./index.css";
import ErrorPage from "./routes/error_page.tsx";
import Root from "./routes/root/root.tsx";
import Transactions from "./routes/transactions/transactions.tsx";
import Budget from "./routes/budget/budget.tsx";
import Friends from "./routes/friends/friends.tsx";
import Loans from "./routes/loans/loans.tsx";
import Requests from "./routes/requests/requests.tsx";
import Dashboard from "./routes/dashboard/dashboard.tsx";
import Calendar from "./routes/calendar/calendar.tsx";
import Login from "./routes/login/login.tsx";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import AuthenticatedRoute from "./components/AuthenticatedRoute/AuthenticatedRoute.tsx";

ChartJS.register(ArcElement, Tooltip, Legend);


const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthenticatedRoute />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Dashboard />,
      },

      {
        path: "transactions",
        element: <Transactions />,
      },
      {
        path: "budget",
        element: <Budget />,
      },
      {
        path: "friends",
        element: <Friends />,
      },
      {
        path: "calendar",
        element: <Calendar />,
      },
      {
        path: "loans",
        element: <Loans />,
      },
      {
        path: "requests",
        element: <Requests />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
    
  </React.StrictMode>
);
