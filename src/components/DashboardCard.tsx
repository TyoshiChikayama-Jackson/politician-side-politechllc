import type { ReactNode } from 'react';

type DashboardCardProps = {
  title: string;
  description: string;
  extra?: ReactNode;
};

export function DashboardCard({ title, description, extra }: DashboardCardProps) {
  return (
    <div className="card">
      <h3>{title}</h3>
      <p>{description}</p>
      {extra}
    </div>
  );
}
