import Image from "next/image";
import CardPreview from "./preview-card";

const FunPreview = () => {
  return (
    <div className="relative w-full h-full" id="fun-preview">
      <CardPreview />
      <div className="target w-[100px] h-[100px] absolute z-50 ">
        <Image
          src="https://media.valorant-api.com/sprays/4c08026b-4f56-9494-0d71-3dbb291c4d7f/fulltransparenticon.png"
          fill
          objectFit="cover"
          alt=""
        />
      </div>
    </div>
  );
};

export default FunPreview;
