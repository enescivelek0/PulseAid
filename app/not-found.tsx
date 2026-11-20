import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto text-center py-20">
      <p className="text-6xl font-extrabold text-white">404</p>
      <p className="mt-2 text-gray-400">Sayfa bulunamadı / Page not found</p>
      <Link href="/" className="mt-6 inline-block px-5 py-3 rounded-2xl bg-white text-navy font-extrabold">PulseAid</Link>
    </div>
  );
}
