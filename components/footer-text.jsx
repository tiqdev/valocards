import Link from "next/link";

const FooterText = () => {
  return (
    <div className="absolute bottom-12 right-12 z-40">
      <Link
        href="https://tiqdev.com"
        target="_blank"
        className="font-bold text-primary drop-shadow-red animate-pulse"
      >
        🔴tiqdev
      </Link>
    </div>
  );
};
export default FooterText;
