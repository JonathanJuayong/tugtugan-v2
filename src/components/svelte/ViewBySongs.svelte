<script lang="ts">
    import PlayIcon from "@lucide/svelte/icons/play";
    interface Props {
        songs: {
            id: string;
            artist: string;
            title: string;
        }[]
    }

    let { songs }: Props = $props()
</script>

<ul class="card divide-y divide-surface-800 bg-surface-950">
    {#each songs as song (song.id)}
        <li>
            <a class="px-4 py-2 flex items-center gap-2 anchor" href={`songs/${song.id}`}>
                <div>
                    <p class="preset-typo-title">
                        {song.title}
                    </p>
                    <p class="preset-typo-subtitle">
                        {song.artist}
                    </p>
                </div>
                <PlayIcon class="ml-auto" />
            </a>
        </li>
    {/each}
</ul>