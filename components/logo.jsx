import Link from "next/link";

const Logo = () => {
  return (
    <Link
      href={"/"}
      className="w-12 h-12 bg-red-400 rounded-sm hover:scale-110 duration-300 font-black text-3xl text-black flex items-center justify-center"
    >
      t
    </Link>
  );
};

export default Logo;
