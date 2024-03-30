"use client";

import { useCardPreview } from "@/stores/main/hooks";
import Image from "next/image";

const CardPreview = () => {
  const card = useCardPreview();

  return (
    <div className="w-[268px] h-[640px] scale-80 md:scale-100 relative ">
      <h2 className="absolute bottom-[214px] left-1/2 -translate-x-1/2 z-20 font-medium text-[16px] text-black">
        {card.username}
      </h2>

      <h3 className="absolute bottom-[193px] w-full left-1/2 -translate-x-1/2 z-20 font-normal text-center text-[11px] text-gray-100">
        {card.title}
      </h3>

      <Image
        src={card.tierIcon}
        width={60}
        height={60}
        alt="{card.cardName}"
        className=" object-contain absolute bottom-[44px] left-1/2 -translate-x-1/2 z-40"
      />

      <Image
        src={"/card_border.png"}
        width={268}
        height={640}
        alt="{card.cardName}"
        className="absolute top-0 left-0 w-full h-full object-contain z-10 "
      />

      <div className="relative h-full w-full">
        <Image
          src={card.cardImage}
          width={268}
          height={640}
          alt="{card.playerCard}"
          className="absolute top-0 left-0 w-full h-full object-contain z-0"
          style={{
            clipPath: "polygon(50% 94%, 100% 76%, 100% 0, 0 0, 0 76%)",
            maskImage: "linear-gradient(to top, transparent 0%, black 30%)",
          }}
        />
      </div>
    </div>
  );
};

export default CardPreview;

/*
 style={{
          clipPath: "polygon(50% 94%, 100% 76%, 100% 0, 0 0, 0 76%)",
        }}
*/
