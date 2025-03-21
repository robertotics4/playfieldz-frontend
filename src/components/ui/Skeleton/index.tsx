interface SkeletonProps {
  className?: string;
}

export const Skeleton = ({ className = "" }: SkeletonProps) => (
  <div
    className={`bg-gray-300 animate-pulse ${className}`}
    style={{ height: "100%", width: "100%" }}
  />
);
