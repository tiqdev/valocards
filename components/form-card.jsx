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
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCardPreview, usePlayerCards, useTitles } from "@/stores/main/hooks";
import { setCardPreview } from "@/stores/main/actions";
import { ScrollArea } from "./ui/scroll-area";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import Image from "next/image";
import { SheetClose, SheetFooter } from "./ui/sheet";

const CardForm = () => {
  const titles = useTitles();
  const playerCards = usePlayerCards();
  const cardPreview = useCardPreview();

  const onSubmit = (data) => {
    console.log(data);
    const card = {
      ...cardPreview,
      username: data.username,
      title: data.title,
      cardImage: data.cardImage,
    };

    console.log(card);
    setCardPreview(card);
  };
  const form = useForm({
    defaultValues: {
      username: "",
      title: "",
      cardImage: "",
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 flex flex-col w-full max-w-[320px] h-full"
      >
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Your cool username" />
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
              <FormLabel>Title</FormLabel>

              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a title" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {titles.map((item) => {
                    return (
                      <SelectItem key={item.displayName} value={item.titleText}>
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
          name="cardImage"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Card</FormLabel>
              <ScrollArea className="h-[calc(100dvh-420px)] min-h-72 rounded-md border p-4">
                <ul className="flex flex-col gap-5">
                  {playerCards.map((item) => {
                    return (
                      <li
                        key={item.uuid}
                        onClick={() => {
                          console.log(item);
                          field.onChange(item.largeArt);
                        }}
                      >
                        <AspectRatio ratio={16 / 4}>
                          <Image
                            src={item.wideArt}
                            alt="Image"
                            fill
                            className="rounded-md object-cover grayscale hover:grayscale-0 transition-all duration-300 ease-in-out cursor-pointer"
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
          <Button type="submit">Generate</Button>
        </SheetClose>
      </form>
    </Form>
  );
};

export default CardForm;
