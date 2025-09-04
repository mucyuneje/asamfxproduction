"use client";

export function Spinner({ size = 12, color = "blue" }: { size?: number; color?: string }) {
  return (
    <div className="flex justify-center items-center min-h-[200px]">
      <div
        className={`animate-spin rounded-full border-4 border-t-transparent border-${color}-500`}
        style={{ width: `${size}px`, height: `${size}px` }}
      ></div>
    </div>
  );
}
