import React from "react";
import { motion } from "framer-motion";
import {
  FaInstagram,
  FaFacebookF,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaArrowRight,
} from "react-icons/fa";
import { SiTiktok, SiSnapchat, SiTelegram } from "react-icons/si";

const Footer = ({ handleNavClick }) => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      icon: FaInstagram,
      href: "https://www.instagram.com/stephnice_collection",
      label: "Instagram",
    },
    {
      icon: FaFacebookF,
      href: "https://.facebook.com/share/1B2xccB8Me/",
      label: "Facebook",
    },
    {
      icon: SiTiktok,
      href: "https://www.tiktok.com/@stephnicecollection",
      label: "TikTok",
    },
    {
      icon: SiSnapchat,
      href: "https://www.snapchat.com/add/stephnice_colec",
      label: "Snapchat",
    },
    {
      icon: SiTelegram,
      href: "https://t.me/stephnicecollection",
      label: "Telegram",
    },
  ];

  return (
    <footer className="bg-zinc-950 text-gray-400 pt-20 pb-10 border-t border-zinc-900">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="space-y-6">
            <h3 className="text-white text-3xl font-black italic tracking-tighter uppercase">
              Cheap<span className="text-indigo-500">Side</span>
            </h3>
            <p className="text-sm leading-relaxed max-w-xs">
              Redefining affordable luxury. We curate the finest quality items
              to ensure you get the best value for your style.
            </p>
            <div className="flex space-x-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-gray-400 hover:bg-indigo-600 hover:text-white transition-all duration-300 border border-zinc-800"
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <social.icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links Column */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-6">
              Quick Shop
            </h4>
            <ul className="space-y-4 text-sm">
              {["New Arrivals", "Trending Now", "Categories"].map((item) => (
                <li key={item}>
                  <button
                    onClick={(e) =>
                      handleNavClick(
                        e,
                        `${item.toLowerCase().replace(/\s+/g, "-")}-section`,
                      )
                    }
                    className="hover:text-indigo-400 transition-colors flex items-center group"
                  >
                    <FaArrowRight className="w-2 h-2 mr-2 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Column */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-6">
              Contact Info
            </h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start space-x-3">
                <FaEnvelope className="w-4 h-4 text-indigo-500 mt-0.5" />
                <a
                  href="mailto:ebortey25@gmail.com"
                  className="hover:text-white transition-colors"
                >
                  CustomerSupport@gmail.com
                </a>
              </li>
              <li className="flex items-start space-x-3">
                <FaPhone className="w-4 h-4 text-indigo-500 mt-0.5" />
                <div className="flex flex-col">
                  <a
                    href="tel:+233549856098"
                    className="hover:text-white transition-colors"
                  >
                    +233 549 856 098
                  </a>
                  <a
                    href="tel:+233558861119"
                    className="hover:text-white transition-colors"
                  >
                    +233 558 861 119
                  </a>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <FaMapMarkerAlt className="w-4 h-4 text-indigo-500 mt-0.5" />
                <span>Kumasi, Ashanti-Ghana</span>
              </li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800">
            <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-4">
              Stay Updated
            </h4>
            <p className="text-xs mb-4">
              Subscribe to get special offers and first look at new arrivals.
            </p>
            <div className="relative">
              <input
                type="email"
                placeholder="Your email"
                className="w-full bg-black border border-zinc-800 rounded-lg py-2.5 px-4 text-xs focus:outline-none focus:border-indigo-500 transition-all"
              />
              <button className="absolute right-1 top-1 bottom-1 px-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
                <FaArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs tracking-wide">
            &copy; {currentYear}{" "}
            <span className="text-white font-bold">CHEAPSIDE</span>. All Rights
            Reserved.
          </p>
          <div className="flex items-center space-x-1 text-xs">
            <span>Powered by</span>
            <a
              href="https://wa.me/233559370174"
              className="text-white font-bold hover:text-indigo-500 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              Acement
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
