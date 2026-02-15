"use client";
import React, { useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { Sparkles, Menu, X } from "lucide-react";

export function Header() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const navLinks = ["Home", "Features", "About", "Community"];

  return (
    <header className="fixed z-50 w-full text-gray-200 bg-darkbg shadow-neon">
      <div className="flex items-center justify-between px-6 py-4 mx-auto max-w-7xl md:px-12">
        {/* Logo */}
        <div className="flex items-center space-x-2 text-2xl font-bold font-display text-neonpurple">
          <Sparkles className="w-8 h-8 text-neonpink" />
          PETTY AI
        </div>

        {/* Desktop Links */}
        <ul className="hidden space-x-8 font-semibold text-gray-300 md:flex">
          {navLinks.map((link) => (
            <li
              key={link}
              className="transition-colors cursor-pointer hover:text-neonblue"
            >
              {link}
            </li>
          ))}
        </ul>

        {/* Desktop Buttons */}
        <div className="hidden space-x-4 md:flex">
         {!session ? (
  <>
    <button
      onClick={() => signIn("github", { callbackUrl: "/" })}
      className="px-4 py-2 transition border rounded-lg border-neonpurple text-neonpurple hover:bg-neonpurple hover:text-darkbg"
    >
      Login
    </button>

    <button
      onClick={() => signIn("github", { callbackUrl: "/" })}
      className="px-4 py-2 transition rounded-lg bg-neonpurple text-darkbg hover:bg-neonpink"
    >
      Sign Up
    </button>
  </>
) : (
  <>
    <span className="px-4 py-2 border rounded-lg bg-darkbg text-neonpurple border-neonpurple">
      Signed in as {session.user.name}
    </span>

    <button
      onClick={() => signOut()}
      className="px-4 py-2 transition rounded-lg bg-neonpink text-darkbg hover:bg-neonpurple"
    >
      Logout
    </button>
  </>
)}

        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center md:hidden">
          <button onClick={toggleMenu}>
            {isOpen ? (
              <X className="w-6 h-6 text-neonpurple" />
            ) : (
              <Menu className="w-6 h-6 text-neonpurple" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="px-6 pb-4 md:hidden bg-darkbg/95 backdrop-blur-md">
          <ul className="flex flex-col space-y-4 text-gray-200">
            {navLinks.map((link) => (
              <li
                key={link}
                className="text-lg font-semibold cursor-pointer hover:text-neonblue"
              >
                {link}
              </li>
            ))}

            <div className="flex flex-col mt-4 space-y-3">
              {!session ? (
                <>
                  <button
                    onClick={() => signIn("github", { callbackUrl: "/" })}
                    className="px-4 py-2 transition border rounded-lg border-neonpurple text-neonpurple hover:bg-neonpurple hover:text-darkbg"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => signIn("github", { callbackUrl: "/" })}
                    className="px-4 py-2 transition rounded-lg bg-neonpurple text-darkbg hover:bg-neonpink"
                  >
                    Sign Up
                  </button>
                </>
              ) : (
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="px-4 py-2 transition rounded-lg bg-neonpink text-darkbg hover:bg-neonpurple"
                >
                  Logout
                </button>
              )}
            </div>
          </ul>
        </div>
      )}
    </header>
  );
}
