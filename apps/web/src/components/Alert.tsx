// src/components/Alert.tsx
interface AlertProps {
  message: string;
  type?: "info" | "success" | "error" | "warning";
}

export default function Alert({ message, type = "error" }: AlertProps) {
  return (
    <div role="alert" className={`alert alert-${type}`}>
      <span>{message}</span>
    </div>
  );
}
