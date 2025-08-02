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
  ArrowDown,
  Eye,
  EyeOff,
  ChevronLeft,
  Lock,
  Check,
  Plus,
  Pencil,
  Trash2,
  Image
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
export const GridIcon = ({ className = "" }) => (
  <Grid3X3 className={mergeClasses('w-6 h-6 text-green-400 dark:text-blue-400', className)} />
);

export const UserCircleIcon = ({ className = "" }) => (
  <UserCircle className={mergeClasses('w-6 h-6 text-green-400 dark:text-blue-400', className)} />
);

export const UsersIcon = ({ className = "" }) => (
  <Users className={mergeClasses('w-6 h-6 text-green-400 dark:text-blue-400', className)} />
);

export const BankIcon = ({ className = "" }) => (
  <Building2 className={mergeClasses('w-6 h-6 text-green-400 dark:text-blue-400', className)} />
);

export const ShieldIcon = ({ className = "" }) => (
  <Shield className={mergeClasses('w-6 h-6 text-green-400 dark:text-blue-400', className)} />
);

export const KeyIcon = ({ className = "" }) => (
  <Key className={mergeClasses('w-6 h-6 text-green-400 dark:text-blue-400', className)} />
);

export const CogIcon = ({ className = "" }) => (
  <Settings className={mergeClasses('w-6 h-6 text-green-400 dark:text-blue-400', className)} />
);

export const ChevronDownIcon = ({ className = "" }) => (
  <ChevronDown className={mergeClasses('w-4 h-4 text-gray-400', className)} />
);

export const MenuIcon = ({ className = "" }) => (
  <Menu className={mergeClasses('w-6 h-6 text-green-400 dark:text-blue-400', className)} />
);

export const XIcon = ({ className = "" }) => (
  <X className={mergeClasses('w-6 h-6 text-green-400 dark:text-blue-400', className)} />
);

export const BellIcon = ({ className = "" }) => (
  <Bell className={mergeClasses('w-6 h-6 text-green-400 dark:text-blue-400', className)} />
);

export const SearchIcon = ({ className = "" }) => (
  <Search className={mergeClasses('w-4 h-4 text-green-400', className)} />
);

export const SunIcon = ({ className = "" }) => (
  <Sun className={mergeClasses('w-5 h-5 text-green-400 dark:text-blue-400', className)} />
);

export const MoonIcon = ({ className = "" }) => (
  <Moon className={mergeClasses('w-5 h-5 text-green-400 dark:text-blue-400', className)} />
);

export const HorizontalDotsIcon = ({ className = "" }) => (
  <MoreHorizontal className={mergeClasses('w-6 h-6 text-green-400 dark:text-blue-400', className)} />
);

export const CurrencyDollarIcon = ({ className = "" }) => (
  <DollarSign className={mergeClasses('w-6 h-6 text-green-400 dark:text-blue-400', className)} />
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

// Authentication and Form Icons
export const EyeIcon = ({ className = "w-4 h-4" }) => (
  <Eye className={className} />
);

export const EyeOffIcon = ({ className = "w-4 h-4" }) => (
  <EyeOff className={className} />
);

export const ChevronLeftIcon = ({ className = "w-4 h-4" }) => (
  <ChevronLeft className={className} />
);

export const LockIcon = ({ className = "w-4 h-4" }) => (
  <Lock className={className} />
);

export const CheckIcon = ({ className = "w-4 h-4" }) => (
  <Check className={className} />
);

export const XMarkIcon = ({ className = "w-4 h-4" }) => (
  <X className={className} />
);

export const PlusIcon = ({ className = "w-4 h-4" }) => (
  <Plus className={className} />
);

export const PencilIcon = ({ className = "w-4 h-4" }) => (
  <Pencil className={className} />
);

export const TrashIcon = ({ className = "w-4 h-4" }) => (
  <Trash2 className={className} />
);

export const PhotoIcon = ({ className = "w-4 h-4" }) => (
  <Image className={className} />
);

// Export the mergeClasses utility function
export { mergeClasses };
