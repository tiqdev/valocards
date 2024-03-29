import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Pencil, RectangleHorizontal, RectangleVertical } from "lucide-react";
import { setCardPreview, setSheetOpen } from "@/stores/main/actions";
import { useCardPreview } from "@/stores/main/hooks";

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
      className="w-[400px] flex flex-row items-center justify-center absolute top-8 left-1/2 -translate-x-1/2 z-10"
    >
      <ToggleGroupItem value="card" aria-label="card">
        <RectangleVertical className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="banner" aria-label="banner">
        <RectangleHorizontal className="h-4 w-4" />
      </ToggleGroupItem>

      <ToggleGroupItem
        value={cardPreview.type}
        onClick={() => {
          setSheetOpen(true);
        }}
      >
        <Pencil className="h-4 w-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  );
};

export default MenuBar;
