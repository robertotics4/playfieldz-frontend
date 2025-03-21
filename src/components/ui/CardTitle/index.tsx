interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
}

export const CardTitle = ({ children, className = "" }: CardTitleProps) => (
  <h2 className={`font-semibold text-xl ${className}`}>{children}</h2>
);
