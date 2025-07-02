import * as React from 'react';
import { Outlet } from 'react-router';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { PageContainer } from '@toolpad/core/PageContainer';

/**
 * Layout component that provides the main dashboard structure
 * This component serves as a wrapper for all dashboard pages
 * Uses Toolpad's DashboardLayout for consistent UI structure
 */
export default function Layout() {
  return (
    <DashboardLayout>
      {/* PageContainer provides consistent spacing and layout for page content */}
      <PageContainer>
        {/* Outlet renders the matched child route component */}
        {/* This is where individual pages (like Estudiantes) will be rendered */}
        <Outlet />
      </PageContainer>
    </DashboardLayout>
  );
}