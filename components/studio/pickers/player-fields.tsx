"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useTranslations } from "@/hooks/use-translations";
import {
  LEVEL_MAX,
  LEVEL_MIN,
  NAME_MAX_LENGTH,
  sanitizeLevel,
  sanitizeName,
  sanitizeTag,
  TAG_MAX_LENGTH,
} from "@/lib/card/config";
import { useCardStore } from "@/stores/card-store";

const FieldLabel = ({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) => (
  <Label
    htmlFor={htmlFor}
    className="font-display text-xs uppercase tracking-widest text-muted-foreground"
  >
    {children}
  </Label>
);

export const PlayerFields = () => {
  const name = useCardStore((state) => state.config.name);
  const tag = useCardStore((state) => state.config.tag);
  const level = useCardStore((state) => state.config.level);
  const update = useCardStore((state) => state.update);
  const t = useTranslations();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <FieldLabel htmlFor="name">{t.username}</FieldLabel>
        <div className="flex items-center gap-2">
          <Input
            id="name"
            value={name}
            maxLength={NAME_MAX_LENGTH}
            placeholder={t.username_placeholder}
            onChange={(event) => update({ name: sanitizeName(event.target.value) })}
            className="h-11 flex-1 text-base"
            autoComplete="off"
          />
          <div className="flex h-11 w-28 items-center rounded-md border border-input bg-transparent pl-3 focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50">
            <span className="text-muted-foreground">#</span>
            <input
              id="tag"
              aria-label={t.tag}
              value={tag}
              maxLength={TAG_MAX_LENGTH}
              placeholder="TR1"
              onChange={(event) => update({ tag: sanitizeTag(event.target.value) })}
              className="h-full w-full bg-transparent px-1 text-base outline-none placeholder:text-muted-foreground"
              autoComplete="off"
            />
          </div>
        </div>
        <p className="text-right text-xs text-muted-foreground">
          {name.length}/{NAME_MAX_LENGTH}
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <FieldLabel htmlFor="level">{t.level}</FieldLabel>
          <Input
            id="level"
            type="number"
            inputMode="numeric"
            min={LEVEL_MIN}
            max={LEVEL_MAX}
            value={level}
            onChange={(event) =>
              update({ level: sanitizeLevel(event.target.valueAsNumber) })
            }
            className="h-9 w-20 text-center font-display text-base"
          />
        </div>
        <Slider
          aria-label={t.level}
          min={LEVEL_MIN}
          max={LEVEL_MAX}
          step={1}
          value={[level]}
          onValueChange={([value]) => {
            if (value !== undefined) update({ level: value });
          }}
        />
      </div>
    </div>
  );
};
