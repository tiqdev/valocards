"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useAgents,
  useCardPreview,
  useFormData,
  usePlayerCards,
  useTiers,
  useTitles,
} from "@/stores/main/hooks";
import { setCardPreview, setFormData } from "@/stores/main/actions";
import { ScrollArea } from "./ui/scroll-area";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import Image from "next/image";
import { SheetClose } from "./ui/sheet";
import { toast } from "sonner";
import { useTranslations } from "@/stores/main/hooks";

const CardForm = () => {
  const titles = useTitles();
  const agents = useAgents();
  const tiers = useTiers();
  const playerCards = usePlayerCards();
  const cardPreview = useCardPreview();
  const formData = useFormData();
  const translations = useTranslations();

  const onSubmit = (data) => {
    console.log(data);

    const _formData = {
      title: data.title,
      username: data.username,
      cardImage: data.cardImage,
      agent: data.agent,
      tier: data.tier,
    };

    if (!data.username) {
      toast.error("Username is required");
      return;
    }

    if (!data.title) {
      toast.error("Title is required");
      return;
    }

    if (!data.agent) {
      toast.error("Agent is required");
      return;
    }

    if (!data.tier) {
      toast.error("Tier is required");
      return;
    }

    if (!data.cardImage) {
      toast.error("Card is required");
      return;
    }

    const card = {
      ...cardPreview,
      username: data.username,
      title: data.title,
      cardImage: data.cardImage.largeArt,
      bannerImage: data.cardImage.wideArt,
      tierName: data.tier,
      tierIcon: tiers.find((item) => item.tierName === data.tier).largeIcon,
      agentName:
        data.agent.toLowerCase().charAt(0).toUpperCase() + data.agent.slice(1),
      agentImage: agents.find((item) => item.displayName === data.agent)
        .displayIcon,
    };

    setCardPreview(card);
    setFormData(_formData);
  };
  const form = useForm({
    defaultValues: formData,
    validateCriteriaMode: "all",
  });

  return (
    <ScrollArea className="h-svh w-full max-w-[360px] rounded-md px-0 pt-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 flex flex-col w-full px-2 h-full"
        >
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel
                  className={field.value === "" ? "text-primary font-bold" : ""}
                >
                  {translations.username}
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder={translations.select_username}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel
                  className={field.value === "" ? "text-primary font-bold" : ""}
                >
                  {translations.title}
                </FormLabel>

                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={translations.select_title} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {titles
                      .filter(
                        (item) =>
                          item.titleText !== "VCT MASTERS REYKJAVIK GALİBİ" &&
                          item.titleText !== "VCT Masters Reykjavik Winner"
                      )
                      .map((item) => {
                        return (
                          <SelectItem
                            key={item.displayName}
                            value={item.titleText}
                          >
                            {item.titleText}
                          </SelectItem>
                        );
                      })}
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="agent"
            render={({ field }) => (
              <FormItem>
                <FormLabel
                  className={field.value === "" ? "text-primary font-bold" : ""}
                >
                  {translations.agent}
                </FormLabel>

                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={translations.select_agent} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {agents.map((item) => {
                      return (
                        <SelectItem
                          key={item.displayName}
                          value={item.displayName}
                        >
                          {item.displayName}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tier"
            render={({ field }) => (
              <FormItem>
                <FormLabel
                  className={field.value === "" ? "text-primary font-bold" : ""}
                >
                  {translations.tier}
                </FormLabel>

                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={translations.select_tier} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {tiers.map((item) => {
                      return (
                        <SelectItem key={item.tierName} value={item.tierName}>
                          {item.tierName}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cardImage"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel
                  className={field.value === "" ? "text-primary font-bold" : ""}
                >
                  {translations.card}
                </FormLabel>
                <ScrollArea className="h-[400px] min-h-72 rounded-md border p-4">
                  <ul className="flex flex-col gap-5">
                    {playerCards.map((item) => {
                      return (
                        <li
                          key={item.uuid}
                          onClick={() => {
                            console.log(item);
                            field.onChange(item);
                          }}
                        >
                          <AspectRatio
                            ratio={16 / 4}
                            className={
                              field.value?.uuid !== item.uuid
                                ? "grayscale hover:scale-95 transition-all duration-300 ease-in-out cursor-pointe"
                                : "hover:scale-95 transition-all duration-300 ease-in-out cursor-pointer"
                            }
                          >
                            <Image
                              src={item.wideArt}
                              alt="Image"
                              fill
                              quality={100}
                              className="rounded-md object-cover transition-all duration-300 ease-in-out cursor-pointer"
                            />
                          </AspectRatio>
                        </li>
                      );
                    })}
                  </ul>
                </ScrollArea>

                <FormMessage />
              </FormItem>
            )}
          />

          <SheetClose asChild>
            <Button type="submit"> {translations.generate_button}</Button>
          </SheetClose>
        </form>
      </Form>
    </ScrollArea>
  );
};

export default CardForm;
