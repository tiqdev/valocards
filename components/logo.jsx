import Image from "next/image";
import Link from "next/link";

const Logo = () => {
  return (
    <Link
      className="absolute left-1/2 -translate-x-1/2 top-12 z-10 "
      href={"/"}
    >
      <Image
        src={"/logo.png"}
        className="drop-shadow-red"
        alt="Logo"
        width={45}
        height={60}
      />
    </Link>
  );
};

export default Logo;
