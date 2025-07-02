import * as React from 'react';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Outlet } from 'react-router';
import { ReactRouterAppProvider } from '@toolpad/core/react-router';
import type { Navigation } from '@toolpad/core/AppProvider';

/**
 * Navigation configuration for the application sidebar
 * Defines the structure and items that appear in the navigation menu
 */
const NAVIGATION: Navigation = [
  {
    kind: 'header',              // Creates a section header in the navigation
    title: 'Main items',         // Header text displayed in the sidebar
  },
  {
    segment: 'Estudiantes',      // URL segment for routing (becomes /Estudiantes)
    title: 'Estudiantes',        // Display name in the navigation menu
    icon: <ShoppingCartIcon />,  // Icon displayed next to the menu item
  },
];

/**
 * Branding configuration for the application
 * Controls the app title and branding elements in the UI
 */
const BRANDING = {
  title: 'Estudiantes',          // Application title shown in the header/toolbar
};

/**
 * Root App component that provides routing and navigation context
 * Sets up the application-wide navigation structure and branding
 * Uses Toolpad's ReactRouterAppProvider for integrated routing and UI
 */
export default function App() {
  return (
    <ReactRouterAppProvider 
      navigation={NAVIGATION}     // Pass navigation configuration to provider
      branding={BRANDING}        // Pass branding configuration to provider
    >
      {/* Outlet renders the matched route component */}
      {/* This will render the Layout component and its children */}
      <Outlet />
    </ReactRouterAppProvider>
  );
}