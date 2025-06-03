import type React from 'react';
import { Eye } from 'lucide-react';

interface LogoProps extends React.SVGProps<SVGSVGElement> {
  iconOnly?: boolean;
}

export function OrderLensLogo({ iconOnly = false, ...props }: LogoProps) {
  return (
    <div className="flex items-center gap-2" aria-label="OrderLens Logo">
      <Eye className="h-8 w-8 text-primary" {...props} />
      {!iconOnly && (
        <span className="text-2xl font-headline font-bold text-foreground">
          Order<span className="text-primary">Lens</span>
        </span>
      )}
    </div>
  );
}
