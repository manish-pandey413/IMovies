import { ArrowUpRight, Menu } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className="relative z-10 flex h-[82px] items-center justify-between border-b border-[#eae8e3] bg-paper px-[8.3%] max-md:h-[72px] max-md:px-[5%] max-sm:h-[66px] max-sm:px-[6%]">
      <a
        className="flex items-center gap-2 text-ink no-underline"
        href="#home"
        aria-label="iMovies home"
      >
        <span className="font-display text-4xl font-bold leading-none tracking-[-5px]">
          i<span className="text-accent">.</span>
        </span>
        <span className="ml-1 text-[17px] font-semibold tracking-[-.7px]">
          movies
        </span>
      </a>
      <nav
        className={`${menuOpen ? "max-sm:flex max-sm:flex-col max-sm:gap-5 max-sm:border-b max-sm:border-[#e8e6e0] max-sm:bg-paper max-sm:px-[6%] max-sm:py-5" : "max-sm:hidden"} absolute left-1/2 flex -translate-x-1/2 gap-9 max-sm:left-0 max-sm:right-0 max-sm:top-[65px] max-sm:translate-x-0`}
        aria-label="Main navigation"
      >
        <a
          className="text-xs font-semibold text-ink no-underline"
          href="#movies"
          onClick={() => setMenuOpen(false)}
        >
          Movies
        </a>
      </nav>
      <div className="flex items-center gap-4">
        <button
          className="flex items-center gap-2 border-0 bg-transparent text-xs font-semibold text-ink"
          onClick={() =>
            window.alert(
              "Sign in will be available when the iMovies API is connected.",
            )
          }
        >
          Sign in <ArrowUpRight size={15} />
        </button>
        <button
          className="hidden border-0 bg-transparent p-1 max-sm:block"
          aria-label="Toggle menu"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <Menu />
        </button>
      </div>
    </header>
  );
}
