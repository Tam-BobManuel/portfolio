"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Logo from "@/../public/assets/Logo.svg";
import Ornament from "@/../public/assets/homepage/OrnamentLight.svg";
import OrnamentDark from "@/../public/assets/homepage/OrnamentDark.svg";
import PlaceholderImg from "@/../public/images/placeholderPerson.png";
import Link from "next/link";
import { gsap } from "gsap";
import { TextPlugin } from "gsap/TextPlugin";

interface HomeClientProps {
  heroImageUrl: string | null;
  words: string[];
}

export default function HomeClient({ heroImageUrl, words }: HomeClientProps) {
  const ornamentLightRef = useRef<HTMLImageElement>(null);
  const ornamentDarkRef = useRef<HTMLImageElement>(null);
  const placeholderImgRef = useRef<HTMLDivElement>(null);
  const placeholderContainerRef = useRef<HTMLDivElement>(null);
  const stunningTextRef = useRef<HTMLSpanElement>(null);
  
  // Register the TextPlugin
  gsap.registerPlugin(TextPlugin);
  
  useEffect(() => {
    // Ornament spinning animation
    if (ornamentLightRef.current && ornamentDarkRef.current) {
      // Create spinning animation for light ornament
      gsap.to(ornamentLightRef.current, {
        rotation: 360,
        duration: 20,
        ease: "none",
        repeat: -1,
        transformOrigin: "center center",
      });

      // Create spinning animation for dark ornament
      gsap.to(ornamentDarkRef.current, {
        rotation: 360,
        duration: 20,
        ease: "none",
        repeat: -1,
        transformOrigin: "center center",
      });
    }

    // Placeholder image animation
    if (placeholderImgRef.current && placeholderContainerRef.current) {
      // Initial state - image starts below the container
      gsap.set(placeholderImgRef.current, {
        y: "100%",
        opacity: 0,
      });

      // Animate the image upward with a slight bounce
      gsap.to(placeholderImgRef.current, {
        y: 0,
        opacity: 1,
        duration: 1.2,
        delay: 0.5,
        ease: "power3.out",
      });
    }

    // Animate the "stunning" text with word rotation
    if (stunningTextRef.current) {
      // Create a timeline for the text animation
      const textTimeline = gsap.timeline({
        repeat: -1,
        repeatDelay: 0.5,
      });

      // Loop through each word and create a text animation
      words.forEach((word, index) => {
        if (index > 0) {
          textTimeline.to(stunningTextRef.current, {
            duration: 0.5,
            opacity: 0,
            ease: "power2.in",
            onComplete: () => {
              if (stunningTextRef.current) {
                stunningTextRef.current.textContent = word;
              }
            },
          });

          textTimeline.to(stunningTextRef.current, {
            duration: 0.5,
            opacity: 1,
            ease: "power2.out",
          });

          // Hold for a moment before changing to the next word
          textTimeline.to({}, { duration: 1.5 });
        }
      });
    }

    // Cleanup function
    return () => {
      gsap.killTweensOf(ornamentLightRef.current);
      gsap.killTweensOf(ornamentDarkRef.current);
      gsap.killTweensOf(placeholderImgRef.current);
      gsap.killTweensOf(stunningTextRef.current);
    };
  }, [words]);

  return (
    <main className="max-h-screen lg:max-h-screen w-full justify-center gap-8">
      {/* Text and picture */}
      <div className="flex flex-col-reverse lg:flex-row w-11/12 mx-auto mt-12 items-center">
        {/* Text */}
        <div className="lg:mt-0 text-center lg:text-left w-full">
          <div className="justify-center lg:justify-start p-0 -mb-4 lg:-mb-0 mx-auto text-center lg:text-left flex flex-row items-center font-bold text-3xl lg:text-6xl">
            <h1>Hi, I&apos;m</h1>
            <Image src={Logo} alt="Tam" className="w-20 h-20 lg:w-30 lg:h-30" />
          </div>
          <h1 className="text-4xl lg:text-6xl font-bold">
            a web developer creating{" "}
            <span ref={stunningTextRef} className="text-[#45A29E]">
              stunning
            </span>{" "}
            solutions
          </h1>
        </div>
        {/* Picture */}
        <div className="flex flex-row w-7/12 justify-center mx-auto">
          <Image
            ref={ornamentLightRef}
            src={Ornament}
            alt="circular pattern"
            className="h-40 w-40 lg:h-70 lg:w-70 -mr-75 mt-25 lg:-mb-0 lg:-mr-40 rounded-full hidden dark:flex"
          />
          <Image
            ref={ornamentDarkRef}
            src={OrnamentDark}
            alt="circular pattern"
            className="h-40 w-40 lg:h-70 lg:w-70 -mr-75 mt-25 lg:-mb-0 lg:-mr-40 rounded-full dark:hidden"
          />
          <div
            ref={placeholderContainerRef}
            className="rounded-full overflow-hidden bg-[#E0D7CC] h-60 w-60 lg:h-90 lg:w-90"
          >
            <div ref={placeholderImgRef} className="h-full w-full">
              <Image
                src={heroImageUrl || PlaceholderImg}
                alt="Profile picture"
                className="h-full w-full object-cover border-none rounded-full"
                width={500}
                height={500}
              />
            </div>
          </div>
        </div>
      </div>
      {/* Learn more */}
      <div className="mt-20 mx-auto items-center justify-center text-center">
        <Link
          href={"/"}
          className="text-xl lg:text-4xl p-2 px-8 rounded-2xl font-bold bg-[#1F2833] text-white dark:bg-[#D9D9D9] dark:text-[#1F2833]"
        >
          Learn more
        </Link>
      </div>
    </main>
  );
}