import Image from "next/image";
import Link from "next/link";

const Logo = () => {
  return (
    <Link className="absolute right-12 top-8 z-10 " href={"/"}>
      <Image
        src={"/logo.png"}
        className="drop-shadow-red"
        alt="Logo"
        width={40}
        height={60}
      />
    </Link>
  );
};

export default Logo;
