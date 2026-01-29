// src/components/Toast.tsx
interface ToastProps {
  message: string;
  type?: "info" | "success" | "error" | "warning";
}

export default function Toast({ message, type = "info" }: ToastProps) {
  return (
    <div className="toast toast-end">
      <div className={`alert alert-${type}`}>
        <span>{message}</span>
      </div>
    </div>
  );
}
