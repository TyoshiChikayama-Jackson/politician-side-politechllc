import React, { PropsWithChildren } from 'react';

export function BrandLayout({ children }: PropsWithChildren) {
  return <div className="brand-shell"><div className="app-shell">{children}</div></div>;
}
