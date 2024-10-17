import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { NavBar } from './Navagation.jsx';
import { App, Account, Game, LogIn, SignUp, LogOut } from './App.jsx';

import './index.css';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
  },
  {
    path: "/home",
    element: <App/>,
  },
  {
    path: "/login",
    element: <LogIn/>,
  },
  {
    path: "/signup",
    element: <SignUp/>,
  },
  {
    path: "/logout",
    element: <LogOut/>,
  },
  {
    path: "/account/:user",
    action: ({ params }) => {},
    element: <Account />,
  },
  {
    path: "/game/:game",
    action: ({ params }) => {},
    element: <Game />,
  },
  {
    path: "*",
    element: (
      <p>Page Not Found</p>
    ),
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <NavBar/>
    <main>
      <RouterProvider router={router} />
    </main>
  </StrictMode>,
);
