"use client";

import { useCardPreview } from "@/stores/main/hooks";
import Image from "next/image";

const BannerPreview = () => {
  const banner = useCardPreview();

  return (
    <div className="w-[600px] flex flex-row gap-1" id="banner-preview">
      <div className="w-[12px] h-[160px] bg-[#57DDC5]"></div>

      <div className="flex flex-col w-full">
        <div className="flex flex-row w-full gap-1">
          <div className="w-[128px] h-[128px] flex flex-col items-center justify-end bg-gradient-to-r from-[#57DDC5]/[.3] to-transparent ">
            <Image
              src={banner.agentImage}
              width={114}
              height={120}
              quality={100}
              objectFit="contain"
              alt="{card.playerCard}"
            />
          </div>
          <Image
            src={banner.bannerImage}
            width={452}
            height={128}
            quality={100}
            alt="{card.playerCard}"
          />
        </div>
        <div className="h-[31px] w-full mt-[1px] relative bg-[#0F1820] tracking-wide">
          <h1 className="absolute top-[0px] left-[6px] z-20 font-medium text-[20px] text-white opacity-90">
            {banner.username}
          </h1>
          <h3 className="absolute top-[8px] left-1/2 -translate-x-1/2 z-20 font-normal text-[11px] text-[#888E93]">
            {banner.title}
          </h3>

          <h2 className="absolute top-[8px] right-[6px]  z-20 font-normal text-[11px] text-[#888E93]">
            {banner.agentName}
          </h2>
        </div>
      </div>
    </div>
  );
};

export default BannerPreview;
