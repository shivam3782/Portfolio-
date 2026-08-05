import { Link } from "react-router-dom";

function Navbar() {
  const links = [
    { label: "HOME", href: "/#home" },
    { label: "QUESTS", href: "/#quests" },
    { label: "STATS", href: "/#stats" },
    { label: "ACHIEVEMENTS", href: "/#achievements" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-[#1a1435] border-b-2 border-[#e8935a] px-6 py-4 flex justify-between items-center">
      <Link to="/" className="font-pixel text-[#e8935a] text-sm">
        SHIVAM.SAVE
      </Link>
      <div className="flex gap-6">
        {links.map((link) => (
          <Link
            key={link.label}
            to={link.href}
            className="font-pixel text-xs text-[#5fb8a8] hover:text-[#f4e8c1] transition-colors"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}

export default Navbar;
