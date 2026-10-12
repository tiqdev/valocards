/* eslint-disable @next/next/no-img-element -- Satori (next/og) yalnızca <img> destekler; önizleme de aynı bileşeni kullanır. */

// Bu bileşen hem tarayıcıdaki önizlemede hem de /api/card altında Satori ile
// PNG üretiminde kullanılır. Bu yüzden sadece inline stil, flex düzen ve
// <img> kullanır; hook veya Tailwind sınıfı içermez.

import { withAlpha } from "@/lib/card/color";
import type { CardData } from "@/lib/card/resolve";

export const CARD_SIZE = {
  vertical: { width: 268, height: 640 },
  horizontal: { width: 600, height: 160 },
} as const;

export interface PlayerCardProps {
  data: CardData;
  /** Dikey kart çerçevesinin adresi (önizlemede yol, sunucuda data URL). */
  frameSrc: string;
  fontFamily: string;
  /** Tüm ölçüleri çarpar; dışa aktarımda 2x çözünürlük için kullanılır. */
  scale?: number;
}

// Satori, clip-path poligonundaki yüzdeleri sağ kenar için yanlış hesaplıyor;
// bu yüzden köşeler piksel olarak verilir (tarayıcıda da aynı sonucu verir).
const fadeStyle = (width: number, height: number) => ({
  clipPath: `polygon(${width * 0.5}px ${height * 0.94}px, ${width}px ${height * 0.76}px, ${width}px 0px, 0px 0px, 0px ${height * 0.76}px)`,
  maskImage: "linear-gradient(to top, transparent 0%, black 30%)",
});

const LevelBadge = ({
  src,
  level,
  px,
}: {
  src: string;
  level: number;
  px: (n: number) => number;
}) => (
  <div
    style={{
      position: "relative",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: px(76),
      height: px(32),
    }}
  >
    <img
      src={src}
      alt=""
      width={px(76)}
      height={px(32)}
      style={{ position: "absolute", top: 0, left: 0 }}
    />
    <span
      style={{
        position: "relative",
        color: "#ffffff",
        fontSize: px(12),
        fontWeight: 500,
        letterSpacing: px(0.5),
      }}
    >
      {level}
    </span>
  </div>
);

const VerticalCard = ({ data, frameSrc, fontFamily, scale = 1 }: PlayerCardProps) => {
  const px = (n: number) => n * scale;
  const { width, height } = CARD_SIZE.vertical;

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        width: px(width),
        height: px(height),
        fontFamily,
      }}
    >
      <img
        src={data.cardLargeArt}
        alt=""
        width={px(width)}
        height={px(height)}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          ...(data.fade ? fadeStyle(px(width), px(height)) : {}),
        }}
      />

      <img
        src={frameSrc}
        alt=""
        width={px(width)}
        height={px(height)}
        style={{ position: "absolute", top: 0, left: px(1) }}
      />

      {data.levelBadge && (
        <div
          style={{
            position: "absolute",
            top: px(360),
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <LevelBadge src={data.levelBadge} level={data.level} px={px} />
        </div>
      )}

      <div
        style={{
          position: "absolute",
          top: px(398),
          left: 0,
          right: 0,
          height: px(30),
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: px(4),
        }}
      >
        <span style={{ fontSize: px(16), fontWeight: 500, color: "#000000" }}>
          {data.name}
        </span>
        {data.tag && (
          <span style={{ fontSize: px(12), color: "#52525b" }}>
            #{data.tag}
          </span>
        )}
      </div>

      <div
        style={{
          position: "absolute",
          top: px(429),
          left: 0,
          right: 0,
          height: px(16),
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span style={{ fontSize: px(11), color: "#f3f4f6" }}>{data.title}</span>
      </div>

      <img
        src={data.tierIcon}
        alt=""
        width={px(60)}
        height={px(60)}
        style={{ position: "absolute", top: px(536), left: px(104) }}
      />
    </div>
  );
};

const HorizontalCard = ({ data, fontFamily, scale = 1 }: PlayerCardProps) => {
  const px = (n: number) => n * scale;
  const { width, height } = CARD_SIZE.horizontal;

  return (
    <div
      style={{
        display: "flex",
        gap: px(4),
        width: px(width),
        height: px(height),
        fontFamily,
      }}
    >
      <div
        style={{
          display: "flex",
          width: px(12),
          height: px(height),
          backgroundColor: data.accentColor,
        }}
      />

      <div style={{ display: "flex", flexDirection: "column", width: px(584) }}>
        <div style={{ display: "flex", gap: px(4), height: px(128) }}>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
              width: px(128),
              height: px(128),
              backgroundImage: `linear-gradient(to right, ${withAlpha(data.accentColor, 0.35)}, ${withAlpha(data.accentColor, 0)})`,
            }}
          >
            <img
              src={data.agentIcon}
              alt=""
              width={px(114)}
              height={px(114)}
            />
          </div>

          <div
            style={{
              position: "relative",
              display: "flex",
              width: px(452),
              height: px(128),
            }}
          >
            <img
              src={data.cardWideArt}
              alt=""
              width={px(452)}
              height={px(128)}
            />
            {data.levelBadge && (
              <div
                style={{
                  position: "absolute",
                  right: px(6),
                  bottom: px(6),
                  display: "flex",
                }}
              >
                <LevelBadge src={data.levelBadge} level={data.level} px={px} />
              </div>
            )}
          </div>
        </div>

        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: px(31),
            marginTop: px(1),
            paddingLeft: px(6),
            paddingRight: px(6),
            backgroundColor: "#0F1820",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ fontSize: px(11), color: "#888E93" }}>
              {data.title}
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "baseline", gap: px(4) }}>
            <span
              style={{
                fontSize: px(20),
                fontWeight: 500,
                color: "rgba(255, 255, 255, 0.9)",
              }}
            >
              {data.name}
            </span>
            {data.tag && (
              <span style={{ fontSize: px(12), color: "#888E93" }}>
                #{data.tag}
              </span>
            )}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: px(6) }}>
            <span style={{ fontSize: px(11), color: "#888E93" }}>
              {data.agentName}
            </span>
            <img src={data.tierIcon} alt="" width={px(22)} height={px(22)} />
          </div>
        </div>
      </div>
    </div>
  );
};

export const PlayerCard = (props: PlayerCardProps) =>
  props.data.layout === "vertical" ? (
    <VerticalCard {...props} />
  ) : (
    <HorizontalCard {...props} />
  );
