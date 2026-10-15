import type Konva from "konva";

/**
 * Sahneyi çıktı çözünürlüğünde PNG'ye çevirir. Ekrandaki sahne küçültülmüş
 * olduğu için pixelRatio ile hedef boyuta büyütülür; seçim kutusu gizlenir.
 */
export const exportStage = async (stage: Konva.Stage, outputWidth: number) => {
  const transformers = stage.find("Transformer");
  transformers.forEach((transformer) => transformer.visible(false));

  try {
    return await stage.toBlob({
      pixelRatio: outputWidth / stage.width(),
      mimeType: "image/png",
    });
  } finally {
    transformers.forEach((transformer) => transformer.visible(true));
    stage.batchDraw();
  }
};
