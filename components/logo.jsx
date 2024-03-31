import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const Logo = () => {
  return (
    <Link
      as={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="absolute left-1/2 -translate-x-1/2 top-12 z-10 "
      href={"/"}
    >
      <Image
        src={"/logo.png"}
        className="drop-shadow-red animate-pulse"
        alt="Logo"
        width={45}
        height={54}
        quality={100}
      />
    </Link>
  );
};

export default Logo;
