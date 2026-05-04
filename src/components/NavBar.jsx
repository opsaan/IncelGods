import { Link } from 'react-router-dom';

export function NavBar() {
  return (
    <header className="glass sticky top-0 z-20 p-3 mb-4">
      <nav className="max-w-5xl mx-auto flex items-center justify-between">
        <Link to="/" className="font-bold text-neon tracking-wide">TrucelGods</Link>
        <div className="text-sm flex gap-4">
          <Link to="/" className="hover:text-neon">Board</Link>
          <Link to="/admin" className="hover:text-neon">Admin</Link>
        </div>
      </nav>
    </header>
  );
}
