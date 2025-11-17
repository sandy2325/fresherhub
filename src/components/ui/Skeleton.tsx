import { clsx } from 'clsx';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'rectangular' | 'circular';
  width?: string | number;
  height?: string | number;
  lines?: number;
}

const Skeleton = ({ className, variant = 'rectangular', width, height, lines = 1 }: SkeletonProps) => {
  const baseClasses = 'animate-pulse bg-gray-200 rounded';

  const variantClasses = {
    text: 'h-4',
    rectangular: '',
    circular: 'rounded-full',
  };

  const skeletonClasses = clsx(
    baseClasses,
    variantClasses[variant],
    className
  );

  const style: React.CSSProperties = {
    width: width || (variant === 'text' ? '100%' : '40px'),
    height: height || (variant === 'text' ? '1rem' : '40px'),
  };

  if (variant === 'text' && lines > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: lines }, (_, index) => (
          <div
            key={index}
            className={clsx(
              baseClasses,
              variantClasses.text,
              className
            )}
            style={{
              width: index === lines - 1 ? '70%' : '100%',
              height: height || '1rem',
            }}
          />
        ))}
      </div>
    );
  }

  return <div className={skeletonClasses} style={style} />;
};

export default Skeleton;