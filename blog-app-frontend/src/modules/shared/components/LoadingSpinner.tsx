export default function LoadingSpinner() {
  return (
    <div
      role="status"
      className="min-h-screen w-full flex justify-center items-center"
    >
      <div className="w-[clamp(30px,7vw,80px)] aspect-square rounded-full animate-spin border-[clamp(4px,1vw,8px)] border-t-primary border-gray-300"></div>
    </div>
  );
}
