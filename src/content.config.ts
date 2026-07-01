import {defineCollection} from "astro:content";
import {glob} from "astro/loaders";
import {z} from "astro/zod";

const songs = defineCollection({
    loader: glob({
        pattern: "**/*.md",
        base: "./src/songs"
    }),
    schema: z.object({
       title: z.string(),
       artist: z.string()
    })
})

export const collections = {songs}