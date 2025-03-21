interface AvatarProps {
  children: React.ReactNode;
  className?: string;
}

export const Avatar = ({ children, className = "" }: AvatarProps) => (
  <div className={`inline-flex items-center justify-center rounded-full ${className}`}>
    {children}
  </div>
);
