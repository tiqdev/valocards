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
import {
  useAgents,
  useCardPreview,
  usePlayerCards,
  useTitles,
} from "@/stores/main/hooks";
import { setCardPreview } from "@/stores/main/actions";
import { ScrollArea } from "./ui/scroll-area";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import Image from "next/image";
import { SheetClose, SheetFooter } from "./ui/sheet";

const CardForm = () => {
  const titles = useTitles();
  const agents = useAgents();
  const playerCards = usePlayerCards();
  const cardPreview = useCardPreview();

  const onSubmit = (data) => {
    console.log(data);
    const card = {
      ...cardPreview,
      username: data.username,
      title: data.title,
      cardImage: data.cardImage.largeArt,
      bannerImage: data.cardImage.wideArt,
      agentName: data.agent,
      agentImage: agents.find((item) => item.displayName === data.agent)
        .displayIcon,
    };

    console.log(card);
    setCardPreview(card);
  };
  const form = useForm({
    defaultValues: {
      username: "",
      title: "",
      cardImage: "",
      agent: "",
    },
  });

  return (
    <ScrollArea className="h-screen w-full max-w-[360px] rounded-md px-0">
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

                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a title" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {titles.map((item) => {
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
                <FormLabel>Agent</FormLabel>

                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select an agent" />
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
            name="cardImage"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Card</FormLabel>
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
    </ScrollArea>
  );
};

export default CardForm;
