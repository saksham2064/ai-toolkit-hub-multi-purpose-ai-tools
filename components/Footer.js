
import React from 'react';
import { Instagram, Twitter, Github, Youtube } from 'lucide-react';

export function Footer() {
  const socialLinks = [
    { icon: Twitter, label: 'Twitter', href: '#' },
    { icon: Instagram, label: 'Instagram', href: '#' },
    { icon: Github, label: 'Github', href: '#' },
    { icon: Youtube, label: 'YouTube', href: '#' },
  ];

  return (
    <footer className="w-full py-12 px-6 md:px-12 mt-auto">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center gap-6">
          {/* Social links */}
          <div className="flex gap-6">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300"
                  style={{
                    backgroundColor: 'var(--dark-card)',
                    border: '2px solid transparent',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--neon-purple)';
                    e.currentTarget.style.backgroundColor = 'var(--neon-purple)20';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'transparent';
                    e.currentTarget.style.backgroundColor = 'var(--dark-card)';
                  }}
                >
                  <Icon className="w-5 h-5 text-gray-400" />
                </a>
              );
            })}
          </div>

          {/* Copyright */}
          <p className="text-gray-500 text-sm">
            © 2026 PettyAI. Built different. 💅
          </p>
        </div>
      </div>
    </footer>
  );
}

