<script lang="ts">
    import {SquareArrowOutUpRightIcon} from "@lucide/svelte";

    interface Song {
        id: string;
        artist: string;
        title: string;
    }

    interface Props {
        songs: Song[]
    }

    let {songs}: Props = $props()

    let groupedByArtists = $derived.by(() => {
        return songs.reduce((previousValue, {artist, id, title}) => {
            const songLink = {
                title,
                id
            }

            if (!previousValue[artist]) {
                return {
                    ...previousValue,
                    [artist]: [songLink]
                }
            }

            return {
                ...previousValue,
                [artist]: [...previousValue[artist], songLink],
            }
        }, {} as Record<string, { title: string, id: string }[]>)
    })

    let groupSongsByArtists = () => {
        return songs.reduce((previousValue, {artist, id, title}) => {
            const songLink = {
                title,
                id
            }

            if (!previousValue[artist]) {
                return {
                    ...previousValue,
                    [artist]: [songLink]
                }
            }

            return {
                ...previousValue,
                [artist]: [...previousValue[artist], songLink],
            }
        }, {} as Record<string, { title: string, id: string }[]>)
    }
    let artists = $derived(Object.keys(groupedByArtists).toSorted())
</script>

<ul class="space-y-6">
    {#each artists as artist (artist)}
        <li class="card px-4 py-4 border border-b-surface-800 dark:border-0 dark:bg-surface-950">
            <p class="preset-typo-title pr-4 mb-1">{artist}</p>
            <ul class="pl-4 border-l-2 border-l-surface-200 dark:border-l-surface-800 ">
                {#each groupSongsByArtists()[artist] as {id, title}}
                    <li>
                        <a class="anchor text-brand-contrast-light dark:anchor flex gap-2 items-center" href={`songs/${id}`}>
                            {title}
                            <SquareArrowOutUpRightIcon size={16}/>
                        </a>
                    </li>
                {/each}
            </ul>
        </li>
    {/each}
</ul>