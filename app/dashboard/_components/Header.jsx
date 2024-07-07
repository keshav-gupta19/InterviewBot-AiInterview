"use client";
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";

const Header = () => {
  const path = usePathname();
  const Router = useRouter();

  return (
    <div className="flex p-4 items-center justify-between bg-secondary shadow-sm max-h-17">
      <Image
        src={"/logofinal1.png"}
        onClick={() => Router.replace("/dashboard")}
        width={160}
        className="cursor-pointer"
        height={50}
        alt="logo"
      />
      <ul className="hidden md:flex gap-6">
        <li
          className={`hover:text-primary hover:font-bold transition-all cursor-pointer ${
            path === "/dashboard" ? "text-primary font-bold" : ""
          }`}
          onClick={() => {
            Router.replace("/dashboard");
          }}
        >
          Dashboard
        </li>
        <li
          className={`hover:text-primary hover:font-bold transition-all cursor-pointer ${
            path === "/questions" ? "text-primary font-bold" : ""
          }`}
        >
          Questions
        </li>
        <li
          className={`hover:text-primary hover:font-bold transition-all cursor-pointer ${
            path === "/upgrade" ? "text-primary font-bold" : ""
          }`}
        >
          Upgrade
        </li>
        <li
          className={`hover:text-primary hover:font-bold transition-all cursor-pointer ${
            path === "/how-it-works" ? "text-primary font-bold" : ""
          }`}
        >
          How It Works
        </li>
      </ul>
      <UserButton />
    </div>
  );
};

export default Header;
