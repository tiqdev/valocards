import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Download,
  Pencil,
  RectangleHorizontal,
  RectangleVertical,
} from "lucide-react";
import { setCardPreview, setSheetOpen } from "@/stores/main/actions";
import { useCardPreview } from "@/stores/main/hooks";
import { toPng, toJpeg } from "html-to-image";

const MenuBar = () => {
  let cardPreview = useCardPreview();
  console.log(cardPreview);

  const tabChange = (value) => {
    cardPreview = {
      ...cardPreview,
      type: value,
    };

    setCardPreview(cardPreview);
  };

  const handleDownloadImage = async () => {
    let element;

    if (cardPreview.type === "card") {
      element = document.getElementById("card-preview");
    } else {
      element = document.getElementById("banner-preview");
    }

    toPng(element, { includeQueryParams: true })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = cardPreview.username + "_card.png";
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <ToggleGroup
      variant="outline"
      type="single"
      defaultValue={cardPreview.type}
      value={cardPreview.type}
      onValueChange={(value) => {
        if (value === "card" || value === "banner") {
          tabChange(value);
        }
      }}
      className="w-[400px] flex flex-row items-center justify-center absolute bottom-12 left-1/2 -translate-x-1/2 z-40"
    >
      <ToggleGroupItem value="card" aria-label="card">
        <RectangleVertical className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="banner" aria-label="banner">
        <RectangleHorizontal className="h-4 w-4" />
      </ToggleGroupItem>

      <ToggleGroupItem
        value="edit"
        aria-label="edit"
        onClick={() => {
          setSheetOpen(true);
        }}
      >
        <Pencil className="h-4 w-4" />
      </ToggleGroupItem>

      <ToggleGroupItem
        value="download"
        aria-label="download"
        onClick={() => {
          handleDownloadImage();
        }}
      >
        <Download className="h-4 w-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  );
};

export default MenuBar;
