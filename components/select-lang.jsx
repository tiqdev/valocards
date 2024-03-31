import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { setSelectedLanguage } from "@/stores/main/actions";
import { useLanguages, useSelectedLanguage } from "@/stores/main/hooks";
import { Languages } from "lucide-react";

const SelectLanguage = () => {
  const selectedLanguage = useSelectedLanguage();
  const languages = useLanguages();

  return (
    <div className="absolute right-12 top-12 z-40">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-10 h-10 p-0">
            <Languages className="h-[1.2rem] w-[1.2rem]" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-24">
          <DropdownMenuLabel>Language</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup
            value={selectedLanguage}
            onValueChange={setSelectedLanguage}
          >
            {languages.map((lang) => (
              <DropdownMenuRadioItem key={lang.value} value={lang}>
                {lang.name}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default SelectLanguage;
