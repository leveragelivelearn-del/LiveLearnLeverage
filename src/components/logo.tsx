import Image from "next/image";
import Link from "next/link";
import React from "react";
import { TextLoop } from "../../components/motion-primitives/text-loop";

interface LogoProps {
  showText?: boolean;
}

const Logo = ({ showText = true }: LogoProps) => {
  return (
    <Link href="/" className="flex items-center gap-2 group">
      <Image src="/assets/3.png" alt="Logo" width={40} height={40} />
      {showText && (
        <TextLoop className='text-3xl font-extrabold text-primary'>
          <span>Live</span>
          <span className="text-[#e23645]">Learn</span>
          <span>Leverage</span>
        </TextLoop>
      )}
    </Link>
  );
};

export default Logo;