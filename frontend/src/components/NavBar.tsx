"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Logo from "@/../public/assets/Logo.svg";
import LogoBlack from "@/../public/assets/blackLogo.svg";
import Link from "next/link";
import { RiMenuFill, RiCloseFill } from "react-icons/ri";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

const navItems = [
  { path: "/", label: "HOME" },
  { path: "/about", label: "About" },
  { path: "/project", label: "Project" },
  { path: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef(null);
  const iconRef = useRef(null);
  const navItemsRef = useRef([]);
  const mainNavRef = useRef(null);
  const logoRef = useRef<HTMLElement | null>(null);

  // Set mounted state after component mounts to prevent hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  // Entry animation for main navbar on page load
  useGSAP(() => {
    if (mainNavRef.current) {
      // Set initial position above viewport
      gsap.set(mainNavRef.current, {
        y: -100,
        opacity: 0,
      });

      // Animate navbar falling into place with a slight bounce
      gsap.to(mainNavRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        delay: 0.2,
        ease: "bounce.out",
      });
    }
  }, []);

  // Logo hover animation
  useGSAP(() => {
    if (!logoRef.current) return;

    // Create hover animation for logo
    logoRef.current.addEventListener("mouseenter", () => {
      gsap.to(logoRef.current, {
        rotation: 10,
        scale: 1.05,
        duration: 0.3,
        ease: "power2.out",
      });
    });

    logoRef.current.addEventListener("mouseleave", () => {
      gsap.to(logoRef.current, {
        rotation: 0,
        scale: 1,
        duration: 0.3,
        ease: "power2.in",
      });
    });

    return () => {
      if (logoRef.current) {
        logoRef.current.removeEventListener("mouseenter", () => {});
        logoRef.current.removeEventListener("mouseleave", () => {});
      }
    };
  }, []);

  // Initial setup for dropdown - only runs once after component is mounted
  useGSAP(() => {
    if (!mounted) return;

    if (dropdownRef.current) {
      gsap.set(dropdownRef.current, {
        opacity: 0,
        y: -20,
        height: 0,
        display: "none", // Initially hidden completely
      });
    }

    // Set the navItems initial state
    navItemsRef.current.forEach((item) => {
      if (item) {
        gsap.set(item, { y: 20, opacity: 0 });
      }
    });
  }, [mounted]);

  // GSAP animation for dropdown opening/closing
  useGSAP(() => {
    if (!dropdownRef.current || !mounted) return;

    if (isOpen) {
      // First make sure element is displayed
      gsap.set(dropdownRef.current, { display: "block" });

      // Then animate dropdown container
      gsap.to(dropdownRef.current, {
        opacity: 1,
        y: 0,
        height: "auto",
        duration: 0.5,
        ease: "power3.out",
      });

      // Staggered animation for each nav item
      gsap.to(navItemsRef.current, {
        y: 0,
        opacity: 1,
        stagger: 0.1,
        delay: 0.3,
        duration: 0.4,
        ease: "power2.out",
      });
    } else {
      // Reset opacity and position for nav items
      navItemsRef.current.forEach((item) => {
        if (item) {
          gsap.to(item, { y: 20, opacity: 0, duration: 0.2 });
        }
      });

      // Animate dropdown closed
      gsap.to(dropdownRef.current, {
        opacity: 0,
        y: -20,
        height: 0,
        duration: 0.4,
        ease: "power3.in",
        onComplete: () => {
          // Hide completely after animation finishes
          gsap.set(dropdownRef.current, { display: "none" });
        },
      });
    }
  }, [isOpen, mounted]);

  // Animate icon transition
  useGSAP(() => {
    if (!iconRef.current || !mounted) return;

    gsap.to(iconRef.current, {
      rotate: isOpen ? 90 : 0,
      duration: 0.3,
      ease: "power2.inOut",
    });
  }, [isOpen, mounted]);

  // Close dropdown when screen size changes to desktop
  useEffect(() => {
    if (!mounted) return;

    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [mounted]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Reset refs array when items change
  const setNavItemRef = (el: HTMLElement | null, index: number) => {
    if (navItemsRef.current) {
      (navItemsRef.current as (HTMLElement | null)[])[index] = el;
    }
  };

  return (
    <>
      {/* Main nav bar */}
      <nav
        ref={mainNavRef}
        className="drop-shadow-xl/50 drop-shadow-[#0B0C10] mt-8 px-8 justify-between overflow-hidden items-center bg-[#1F2833] dark:bg-[#E0D7CC] text-[#E0D7CC] dark:text-[#0B0C10] flex flex-row rounded-3xl w-10/12 lg:w-8/12 mx-auto mb-0 relative z-50"
      >
        {/* Nav bar logo with hover effect */}
        {/* @ts-expect-error */}
        <div ref={logoRef} className="w-full md:w-auto cursor-pointer">
          <Image
            src={Logo}
            alt="Website Logo"
            width={100}
            height={45}
            className="dark:hidden"
          />
          <Image
            src={LogoBlack}
            alt="Website Logo dark"
            width={100}
            height={45}
            className="hidden dark:block"
          />
        </div>
        {/* Nav bar links */}
        <div className="flex flex-row gap-4 hidden lg:flex">
          <ul className="flex flex-row gap-6 items-center pr-4">
            {navItems.map(({ path, label }) => (
              <li
                key={path}
                className="text-xl font-light text-[#E0D7CC] dark:text-[#0B0C10] uppercase transition duration-200 ease-in-out hover:font-medium"
              >
                <Link href={path}>{label}</Link>
              </li>
            ))}
          </ul>
          <div className="rounded-4xl py-3 px-4 my-1.5 bg-[#E0D7CC] dark:bg-[#1F2833] text-black dark:text-[#F1F1F1] text-xl font-light">
            Resume
          </div>
        </div>
        {/* Mobile nav icon */}
        <div className="lg:hidden flex items-center">
          <button
            onClick={toggleDropdown}
            aria-label="Toggle mobile menu"
            className="focus:outline-none"
            ref={iconRef}
          >
            {isOpen ? (
              <RiCloseFill className="text-3xl text-[#E0D7CC] dark:text-[#0B0C10]" />
            ) : (
              <RiMenuFill className="text-3xl text-[#E0D7CC] dark:text-[#0B0C10]" />
            )}
          </button>
        </div>
      </nav>
      {/* Dropdown nav bar - always render but control visibility with GSAP */}
      {mounted && (
        <nav
          className="lg:hidden overflow-hidden relative z-40"
          ref={dropdownRef}
        >
          <div className="p-4 flex flex-col bg-[#1F2833] dark:bg-[#E0D7CC] text-[#E0D7CC] dark:text-[#0B0C10] rounded-3xl w-9/12 lg:w-7/12 mx-auto -mt-6 pt-10">
            <ul className="flex flex-col gap-6 text-left pl-2">
              {navItems.map(({ path, label }, index) => (
                <li
                  key={path}
                  ref={(el) => setNavItemRef(el, index)}
                  className="text-xl font-semibold text-[#E0D7CC] dark:text-[#0B0C10] uppercase"
                >
                  <Link href={path} onClick={() => setIsOpen(false)}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
            <div
              ref={(el) => setNavItemRef(el, navItems.length)}
              className="w-6/12 md:w-3/12 text-center rounded-4xl py-1.5 mt-4 bg-[#E0D7CC] dark:bg-[#1F2833] text-black dark:text-[#F1F1F1] text-xl font-light"
            >
              Resume
            </div>
          </div>
        </nav>
      )}
    </>
  );
}
