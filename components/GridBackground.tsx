"use client";

export default function GridBackground() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden opacity-[0.4]"
      aria-hidden
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, var(--muted-foreground) 1px, transparent 0)`,
          backgroundSize: "32px 32px",
        }}
      />
    </div>
  );
}
