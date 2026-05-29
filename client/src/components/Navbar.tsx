import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { href: "/home", label: "HOME" },
  { href: "/gallery", label: "GALLERY" },
  { href: "/apply", label: "APPLY WL" },
  { href: "/check-role", label: "CHECK ROLE" },
  { href: "/mint", label: "MINT" },
];

export function Navbar() {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3"
        style={{
          background: "rgba(10,6,3,0.90)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(200,120,40,0.2)",
          fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
        }}
      >
        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-5 py-2 rounded-lg text-sm font-bold tracking-widest cursor-pointer transition-all duration-200 ${
                    isActive
                      ? "bg-orange-500 text-white shadow-lg"
                      : "text-white/70 hover:text-orange-400 hover:bg-orange-500/10"
                  }`}
                >
                  {item.label}
                </motion.div>
              </Link>
            );
          })}
        </div>

        {/* Hamburger button */}
        <button
          onClick={() => setOpen((p) => !p)}
          className="md:hidden flex flex-col justify-center items-center gap-1.5 w-10 h-10 rounded-lg ml-auto"
          style={{
            background: open ? "rgba(249,115,22,0.15)" : "transparent",
            border: "1px solid rgba(249,115,22,0.3)",
            cursor: "pointer",
          }}
        >
          <motion.span
            animate={open ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.25 }}
            style={{
              display: "block",
              width: "18px",
              height: "2px",
              background: "#f97316",
              borderRadius: "2px",
            }}
          />
          <motion.span
            animate={open ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.2 }}
            style={{
              display: "block",
              width: "18px",
              height: "2px",
              background: "#f97316",
              borderRadius: "2px",
            }}
          />
          <motion.span
            animate={open ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.25 }}
            style={{
              display: "block",
              width: "18px",
              height: "2px",
              background: "#f97316",
              borderRadius: "2px",
            }}
          />
        </button>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setOpen(false)}
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.6)",
                zIndex: 40,
              }}
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              style={{
                position: "fixed",
                top: 0,
                right: 0,
                bottom: 0,
                width: "72vw",
                maxWidth: "280px",
                background: "rgba(10,6,3,0.97)",
                borderLeft: "1px solid rgba(200,120,40,0.25)",
                zIndex: 45,
                display: "flex",
                flexDirection: "column",
                paddingTop: "5rem",
                paddingBottom: "2rem",
                paddingLeft: "1.5rem",
                paddingRight: "1.5rem",
                gap: "6px",
              }}
            >
              {/* Decorative top line */}
              <div
                style={{
                  position: "absolute",
                  top: "4.2rem",
                  left: "1.5rem",
                  right: "1.5rem",
                  height: "1px",
                  background: "linear-gradient(90deg, rgba(249,115,22,0.6), transparent)",
                }}
              />

              {navItems.map((item, i) => {
                const isActive = location === item.href;
                return (
                  <Link key={item.href} href={item.href}>
                    <motion.div
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06, duration: 0.3 }}
                      onClick={() => setOpen(false)}
                      style={{
                        padding: "14px 18px",
                        borderRadius: "12px",
                        fontFamily: "'Bangers', cursive",
                        fontSize: "1.2rem",
                        letterSpacing: "0.12em",
                        cursor: "pointer",
                        background: isActive
                          ? "rgba(249,115,22,0.2)"
                          : "transparent",
                        color: isActive ? "#f97316" : "rgba(255,255,255,0.65)",
                        borderLeft: isActive
                          ? "3px solid #f97316"
                          : "3px solid transparent",
                        transition: "background 0.2s, color 0.2s",
                      }}
                    >
                      {item.label}
                    </motion.div>
                  </Link>
                );
              })}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
