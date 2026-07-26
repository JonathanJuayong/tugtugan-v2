import {defineCollection} from "astro:content";
import {glob} from "astro/loaders";
import {z} from "astro/zod";

const songs = defineCollection({
    loader: glob({
        pattern: "**/*.md",
        base: "./src/songs",
        generateId: ({data}) => {
            const artist = data?.artist as string | undefined
            const title = data?.title as string | undefined

            if (!artist || !title) return ""

            const artistSlug = artist.replaceAll(" ", "-").toLowerCase().trim()
            const titleSlug = title.replaceAll(" ", "-").toLowerCase().trim()

            return `${titleSlug}-${artistSlug}`
        }
    }),
    schema: z.object({
        title: z.string(),
        artist: z.string()
    })
})

export const collections = {songs}