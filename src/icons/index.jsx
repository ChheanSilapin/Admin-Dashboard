// Dashboard and Navigation Icons using Lucide React
import {
  Grid3X3,
  UserCircle,
  Users,
  Building2,
  Shield,
  Key,
  Settings,
  ChevronDown,
  Menu,
  X,
  Bell,
  Search,
  Sun,
  Moon,
  MoreHorizontal,
  DollarSign,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

const mergeClasses = (defaultClasses, customClasses) => {
  if (!customClasses) return defaultClasses;

  const defaultArray = defaultClasses.split(' ').filter(Boolean);
  const customArray = customClasses.split(' ').filter(Boolean);

  const getClassPrefix = (className) => {
    const responsiveMatch = className.match(/^((?:[a-z]+:)*)/);
    const responsivePrefix = responsiveMatch ? responsiveMatch[1] : '';
    const actualClass = className.substring(responsivePrefix.length);
    const match = actualClass.match(/^([a-z]+(?:-[a-z]+)*?)(?:-|$)/);
    const basePrefix = match ? match[1] : actualClass;
    return responsivePrefix + basePrefix;
  };
  const customPrefixes = new Set(customArray.map(getClassPrefix));
  const filteredDefaults = defaultArray.filter(defaultClass => {
    const defaultPrefix = getClassPrefix(defaultClass);
    return !customPrefixes.has(defaultPrefix);
  });

  return [...filteredDefaults, ...customArray].join(' ');
};


// Wrapper components to maintain backward compatibility
export const GridIcon = ({ className = "w-6 h-6" }) => (
  <Grid3X3 className={className} />
);

export const UserCircleIcon = ({ className = "w-6 h-6" }) => (
  <UserCircle className={className} />
);

export const UsersIcon = ({ className = "w-6 h-6" }) => (
  <Users className={className} />
);

export const BankIcon = ({ className = "w-6 h-6" }) => (
  <Building2 className={className} />
);

export const ShieldIcon = ({ className = "w-6 h-6" }) => (
  <Shield className={className} />
);

export const KeyIcon = ({ className = "w-6 h-6" }) => (
  <Key className={className} />
);

export const CogIcon = ({ className = "w-6 h-6" }) => (
  <Settings className={className} />
);

export const ChevronDownIcon = ({ className = "w-5 h-5" }) => (
  <ChevronDown className={className} />
);

export const MenuIcon = ({ className = "w-6 h-6" }) => (
  <Menu className={className} />
);

export const XIcon = ({ className = "w-6 h-6" }) => (
  <X className={className} />
);

export const BellIcon = ({ className = "w-6 h-6" }) => (
  <Bell className={className} />
);

export const SearchIcon = ({ className = "" }) => (
  <Search className={mergeClasses('w-4 h-4 text-green-500', className)} />
);

export const SunIcon = ({ className = "w-5 h-5" }) => (
  <Sun className={className} />
);

export const MoonIcon = ({ className = "w-5 h-5" }) => (
  <Moon className={className} />
);

export const HorizontalDotsIcon = ({ className = "w-6 h-6" }) => (
  <MoreHorizontal className={className} />
);

export const CurrencyDollarIcon = ({ className = "w-6 h-6" }) => (
  <DollarSign className={className} />
);

export const ArrowUpIcon = ({ className = "w-4 h-4" }) => (
  <ArrowUp className={className} />
);

export const ArrowDownIcon = ({ className = "w-4 h-4" }) => (
  <ArrowDown className={className} />
);
export const TrendingUpIcon = ({ className = "w-4 h-4" }) => (
  <ArrowUp className={className} />
);
export const EyeIcon = ({ className = "w-4 h-4" }) => (
  <ArrowDown className={className} />
);
export const PercentIcon = ({ className = "w-4 h-4" }) => (
  <ArrowDown className={className} />
);
export const PencilIcon = ({ className = "w-4 h-4" }) => (
  <ArrowDown className={className} />
);
export const TrashIcon = ({ className = "w-4 h-4" }) => (
  <ArrowDown className={className} />
);
export const PhotoIcon = ({ className = "w-4 h-4" }) => (
  <ArrowDown className={className} />
);
export const LockIcon = ({ className = "w-4 h-4" }) => (
  <ArrowDown className={className} />
);
export const CheckIcon = ({ className = "w-4 h-4" }) => (
  <ArrowDown className={className} />
);
export const XMarkIcon = ({ className = "w-4 h-4" }) => (
  <ArrowDown className={className} />
);
export const PlusIcon = ({ className = "w-4 h-4" }) => (
  <ArrowDown className={className} />
);
