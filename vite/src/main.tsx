import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router';
import App from './App';
import Layout from './layouts/dashboard';
import ImportarEstudiantes from './pages/Estudiantes';

/**
 * Router configuration using React Router v7
 * Defines the application's routing structure with nested routes
 * 
 * Route Structure:
 * / (App component - provides navigation context)
 *   └── / (Layout component - provides dashboard structure)
 *       └── /Estudiantes (ImportarEstudiantes component - students page)
 */
const router = createBrowserRouter([
  {
    Component: App,              // Root component that provides app-wide context
    children: [
      {
        path: '/',               // Base path for the dashboard
        Component: Layout,       // Dashboard layout wrapper
        children: [
          {
            path: 'Estudiantes',  // Students page route (/Estudiantes)
            Component: ImportarEstudiantes,  // Students management component
          },
        ],
      },
    ],
  },
]);

/**
 * Application entry point
 * Creates the React root and renders the application with routing
 * Note: There's a syntax error in the original - should be "router={router}"
 */
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* Fix: Should be router={router} instead of routerrouter={router} */}
    <RouterProvider router={router} />
  </React.StrictMode>,
);