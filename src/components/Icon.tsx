import React from 'react';
import * as Lucide from 'lucide-react';

interface IconProps extends React.ComponentPropsWithoutRef<'svg'> {
  name: string;
  className?: string;
  size?: number | string;
  fill?: string;
  key?: React.Key;
}

export default function Icon({ name, className = '', size = 20, ...props }: IconProps) {
  // Safe mapping of icon name to Lucide Icon component
  const IconComponent = (Lucide as any)[name];

  if (!IconComponent) {
    // Return a fallback question mark icon if name not found
    return <Lucide.HelpCircle className={className} size={size} {...props} />;
  }

  return <IconComponent className={className} size={size} {...props} />;
}
