export enum LoadingSize {
  XS = "loading-xs",
  SM = "loading-sm",
  MD = "loading-md",
  LG = "loading-lg",
  XL = "loading-xl",
}

interface LoadingDotsProps {
  size?: LoadingSize; // tamaño opcional, por defecto 'md'
  className?: string; // permite añadir clases extras si se necesita
}

export default function LoadingDots({
  size = LoadingSize.MD,
  className = "",
}: LoadingDotsProps) {
  return (
    <span className={`loading loading-dots ${size} ${className}`}></span>
  );
}