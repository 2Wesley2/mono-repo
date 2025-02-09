import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader } from '../../ui/sidebar';
import React from 'react';

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup />
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
