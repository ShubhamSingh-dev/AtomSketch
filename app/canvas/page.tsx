"use client";
import WorkSpace from "@/views/WorkSpace";
import { Suspense } from "react";

export default function CanvasPage() {
  return (
    <Suspense fallback={<div>Loading canvas...</div>}>
      <WorkSpace />
    </Suspense>
  );
}
