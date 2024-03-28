"use client";

import Image from "next/image";

const CardPreview = () => {
  let card = {
    title: "Miyav",
    username: "Zena",
    cardImage:
      "https://media.valorant-api.com/playercards/109ea8c8-b372-4fe0-be3c-a5c3e549b38a/largeart.png",
    cardName: "KÜBİK TİLKİ KARTI",
  };

  return (
    <div className="w-[268px] h-[640px]  relative">
      <h2 className="absolute bottom-[214px] left-1/2 -translate-x-1/2 z-20 font-medium text-[16px] text-black">
        {card.username}
      </h2>

      <h3 className="absolute bottom-[189px] left-1/2 -translate-x-1/2 z-20 font-normal text-[12px] text-gray-100">
        {card.title}
      </h3>

      <Image
        src={"/card_border.png"}
        width={268}
        height={640}
        alt={card.cardName}
        className="absolute top-0 left-0 w-full h-full object-contain z-10"
      />

      <Image
        src={card.cardImage}
        width={268}
        height={640}
        alt={card.playerCard}
        className="absolute top-0 left-0 w-full h-full object-contain"
      />
    </div>
  );
};

export default CardPreview;

/*
 style={{
          clipPath: "polygon(50% 94%, 100% 76%, 100% 0, 0 0, 0 76%)",
        }}
*/
