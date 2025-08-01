/**
 * Khmer Text Component
 * A utility component for displaying Khmer text with proper font support
 */

const KhmerText = ({ 
  children, 
  className = '', 
  size = 'base',
  weight = 'normal',
  ...props 
}) => {
  const sizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm', 
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl'
  };

  const weightClasses = {
    light: 'font-light',
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold'
  };

  const classes = [
    'font-khmer',
    sizeClasses[size] || sizeClasses.base,
    weightClasses[weight] || weightClasses.normal,
    className
  ].filter(Boolean).join(' ');

  return (
    <span className={classes} {...props}>
      {children}
    </span>
  );
};

export default KhmerText;
