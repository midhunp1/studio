import type React from 'react';
import { Eye } from 'lucide-react';
import Link from 'next/link';

interface LogoProps extends React.SVGProps<SVGSVGElement> {
  iconOnly?: boolean;
  takeawayName?: string;
}

export function OrderLensLogo({ iconOnly = false, takeawayName, ...props }: LogoProps) {
  const content = (
    <div className="flex items-center gap-2" aria-label={takeawayName || "OrderLens Logo"}>
      <Eye className="h-8 w-8 text-primary" {...props} />
      {!iconOnly && takeawayName && (
        <span className="text-2xl font-headline font-bold text-foreground">
          {takeawayName}
        </span>
      )}
      {!iconOnly && !takeawayName && (
        <span className="text-2xl font-headline font-bold text-foreground">
          Order<span className="text-primary">Lens</span>
        </span>
      )}
    </div>
  );

  if (takeawayName) {
    return (
      <Link href="/takeaways" className="hover:opacity-80 transition-opacity">
        {content}
      </Link>
    );
  }

  return content;
}
