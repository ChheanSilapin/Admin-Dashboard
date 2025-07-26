import React from 'react';
import { useSidebar } from '../../contexts/SidebarContext';

const Backdrop = () => {
  const { isMobileOpen, closeMobileSidebar } = useSidebar();

  if (!isMobileOpen) return null;

  return (
    <div
      className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
      onClick={closeMobileSidebar}
      aria-hidden="true"
    />
  );
};

export default Backdrop;
