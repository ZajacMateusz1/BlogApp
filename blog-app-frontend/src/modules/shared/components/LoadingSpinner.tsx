interface LoadingSpinnerProps {
  fullScreen?: boolean;
}
export default function LoadingSpinner({
  fullScreen = true,
}: LoadingSpinnerProps) {
  return (
    <div
      role="status"
      className={`${fullScreen ? "min-h-screen" : "h-full"} w-full flex justify-center items-center`}
    >
      <div className="w-[clamp(30px,7vw,80px)] aspect-square rounded-full animate-spin border-[clamp(4px,1vw,8px)] border-t-primary border-gray-300"></div>
    </div>
  );
}
