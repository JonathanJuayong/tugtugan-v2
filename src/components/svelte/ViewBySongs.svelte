<script lang="ts">
    import {PlayIcon} from "@lucide/svelte";

    interface Props {
        songs: {
            id: string;
            artist: string;
            title: string;
            tags: string[];
        }[]
    }

    let {songs}: Props = $props()
</script>

<ul class="card divide-y divide-surface-800 border border-b-surface-800 dark:border-0 dark:bg-surface-950">
    {#each songs as song (song.id)}
        <li>
            <a class="px-4 py-2 flex items-center gap-2 anchor " href={`songs/${song.id}`}>
                <div>
                    <p class="preset-typo-title truncate max-w-[20ch] sm:max-w-fit">
                        {song.title}
                    </p>
                    <p class="preset-typo-subtitle truncate max-w-[20ch] sm:max-w-fit">
                        {song.artist}
                    </p>
                    <ul class="flex flex-wrap gap-2 mt-2">
                        {#each song.tags as tag}
                        <li class="chip preset-outlined-surface-500">{tag}</li>
                        {/each}
                    </ul>
                </div>
                <PlayIcon class="ml-auto"/>
            </a>
        </li>
    {/each}
</ul>