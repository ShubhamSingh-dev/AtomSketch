
import Link from 'next/link';

export default function HomePage() {
  return (
    <div>
      <h1>Welcome to SketchFlow!</h1>
      <p>This is your landing page.</p>
      <Link href="/canvas">Go to Canvas</Link>
    </div>
  );
}