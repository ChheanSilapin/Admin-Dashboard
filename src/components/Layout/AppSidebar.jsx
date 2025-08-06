import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSidebar } from '../../contexts/SidebarContext';
import { useAuth, PERMISSIONS } from '../../contexts/AuthContext';
import {
  GridIcon,
  UserCircleIcon,
  UsersIcon,
  BankIcon,
  ShieldIcon,
  KeyIcon,
  CogIcon,
  ChevronDownIcon,
  HorizontalDotsIcon,
} from '../../icons';


const navItems = [
  {
    icon: <GridIcon />,
    name: "Dashboard",
    path: "/",
    permission: PERMISSIONS.DASHBOARD_VIEW,
  },
  {
    icon: <UsersIcon />,
    name: "Customer",
    path: "/customers",
    permission: PERMISSIONS.CUSTOMER_VIEW,
  },
  {
    icon: <BankIcon />,
    name: "Bank",
    path: "/banks",
    // permission: PERMISSIONS.BANK_VIEW, // Temporarily removed for testing
  },
];

const adminItems = [
  {
    icon: <ShieldIcon />,
    name: "Roles",
    permission: PERMISSIONS.ROLES_VIEW,
    subItems: [
      {
        name: "All Roles",
        path: "/roles",
        permission: PERMISSIONS.ROLES_VIEW,
      },
      {
        name: "Add Role",
        path: "/roles/add",
        permission: PERMISSIONS.ROLES_CREATE,
      },
    ],
  },
  {
    icon: <KeyIcon />,
    name: "Permissions",
    permission: PERMISSIONS.PERMISSIONS_VIEW,
    subItems: [
      {
        name: "All Permissions",
        path: "/permissions",
        permission: PERMISSIONS.PERMISSIONS_VIEW,
      },
      {
        name: "Add Permission",
        path: "/permissions/add",
        permission: PERMISSIONS.PERMISSIONS_CREATE,
      },
    ],
  },
  {
    icon: <CogIcon />,
    name: "Role Permissions",
    permission: PERMISSIONS.ROLE_PERMISSIONS_VIEW,
    subItems: [
      {
        name: "Manage Assignments",
        path: "/role-permissions",
        permission: PERMISSIONS.ROLE_PERMISSIONS_VIEW,
      },
    ],
  },
  {
    icon: <UserCircleIcon />,
    name: "Authentication",
    permission: PERMISSIONS.USERS_VIEW,
    subItems: [
      {
        name: "Users",
        path: "/users",
        permission: PERMISSIONS.USERS_VIEW,
      },
      {
        name: "Login Settings",
        path: "/auth/settings",
        permission: PERMISSIONS.USERS_VIEW,
      },
    ],
  },
];

const AppSidebar = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const { hasPermission, canAccessAdministration, user, isAuthenticated } = useAuth();
  const location = useLocation();

  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [subMenuHeight, setSubMenuHeight] = useState({});
  const subMenuRefs = useRef({});

  const isActive = useCallback(
    (path) => location.pathname === path,
    [location.pathname]
  );

  useEffect(() => {
    let submenuMatched = false;
    ["main", "admin"].forEach((menuType) => {
      const items = menuType === "main" ? navItems : adminItems;
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({
                type: menuType,
                index,
              });
              submenuMatched = true;
            }
          });
        }
      });
    });

    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [location, isActive]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index, menuType) => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  // Filter menu items based on user permissions
  const filterMenuItems = (items) => {
    if (!isAuthenticated) return [];

    return items.filter(item => {
      // Check if user has permission for the main item
      if (item.permission && !hasPermission(item.permission)) {
        return false;
      }

      // If item has subItems, filter them too
      if (item.subItems) {
        const filteredSubItems = item.subItems.filter(subItem => {
          return !subItem.permission || hasPermission(subItem.permission);
        });

        // Only show parent item if it has accessible sub-items or no permission requirement
        return filteredSubItems.length > 0 || !item.permission;
      }

      return true;
    }).map(item => {
      // Return item with filtered subItems if applicable
      if (item.subItems) {
        return {
          ...item,
          subItems: item.subItems.filter(subItem => {
            return !subItem.permission || hasPermission(subItem.permission);
          })
        };
      }
      return item;
    });
  };

  // Remove read-only indicators from sidebar - they're not needed
  const isReadOnlyItem = (item) => {
    return false; // Always return false to remove "View Only" badges
  };

  const renderMenuItems = (items, menuType) => {
    const filteredItems = filterMenuItems(items);

    return (
      <ul className="flex flex-col gap-4">
        {filteredItems.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`menu-item group ${
                openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? "menu-item-active"
                  : "menu-item-inactive"
              } cursor-pointer ${
                !isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "lg:justify-start"
              }`}
            >
              <span
                className={`menu-item-icon-size ${
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? "menu-item-icon-active"
                    : "menu-item-icon-inactive"
                }`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className="menu-item-text flex items-center gap-2">
                  {nav.name}
                  {isReadOnlyItem(nav) && (
                    <span className="text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 px-1.5 py-0.5 rounded">
                      View Only
                    </span>
                  )}
                </span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDownIcon
                  className={`ml-auto w-5 h-5 transition-transform duration-200 ${
                    openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                      ? "rotate-180"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                to={nav.path}
                className={`menu-item group ${
                  isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                }`}
              >
                <span
                  className={`menu-item-icon-size ${
                    isActive(nav.path)
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                  }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text flex items-center gap-2">
                    {nav.name}
                    {isReadOnlyItem(nav) && (
                      <span className="text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 px-1.5 py-0.5 rounded">
                        View Only
                      </span>
                    )}
                  </span>
                )}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      to={subItem.path}
                      className={`menu-dropdown-item ${
                        isActive(subItem.path)
                          ? "menu-dropdown-item-active"
                          : "menu-dropdown-item-inactive"
                      }`}
                    >
                      {subItem.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
        ))}
      </ul>
    );
  };

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 border-r border-green-200 dark:border-blue-400 text-gray-900 dark:text-white h-screen transition-all duration-300 ease-in-out z-50
        ${
          isExpanded || isMobileOpen
            ? "w-[290px]"
            : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Logo */}
      <div
        className={`py-8 flex ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        <Link to="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <div className="text-xl font-bold text-gray-800 dark:text-white">
              Admin Dashboard
            </div>
          ) : (
            <div className="w-8 h-8 bg-white dark:bg-gray-900 rounded-lg flex items-center justify-center text-gray-800 dark:text-white font-bold">
              A
            </div>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            {/* Main Menu */}
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Menu"
                ) : (
                  <HorizontalDotsIcon className="size-6" />
                )}
              </h2>
              {renderMenuItems(navItems, "main")}
            </div>

            {/* Admin Menu - Only show if user has administration access */}
            {canAccessAdministration() && (
              <div>
                <h2
                  className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                    !isExpanded && !isHovered
                      ? "lg:justify-center"
                      : "justify-start"
                  }`}
                >
                  {isExpanded || isHovered || isMobileOpen ? (
                    "Administration"
                  ) : (
                    <HorizontalDotsIcon />
                  )}
                </h2>
                {renderMenuItems(adminItems, "admin")}
              </div>
            )}
          </div>
        </nav>

        {/* User Info Section */}
        {isAuthenticated && user && (
          <div className="mt-auto mb-6 px-2">
            <div className={`p-3 bg-gray-50 dark:bg-gray-800 rounded-lg ${
              !isExpanded && !isHovered ? "lg:px-2" : ""
            }`}>
              {isExpanded || isHovered || isMobileOpen ? (
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {user.username}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                      {user.role.replace('_', ' ')}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex justify-center">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default AppSidebar;
