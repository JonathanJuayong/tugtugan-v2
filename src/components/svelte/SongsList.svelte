<script lang="ts">
    import PlayIcon from '@lucide/svelte/icons/play'

    interface Props {
        songs: {
            id: string;
            artist: string;
            title: string;
        }[]
    }

    let { songs }: Props = $props()
    let search = $state('')
    let displayedSongs = $derived.by(() => {
        const query = search.toLowerCase().trim()
        if (query === '') return songs

        return songs.filter(song => {
            const artist = song.artist.toLowerCase().trim()
            const title = song.title.toLowerCase().trim()
            return artist.includes(query) || title.includes(query)
        })
    })
</script>

<form>
    <label class="label" for="search">
        <span class="label-text">Search</span>
        <input bind:value={search} id="search" type="text" autocomplete="off" placeholder="Search for any artist or song" name="search" class="input" />
    </label>
</form>
<p class="preset-typo-caption">{displayedSongs.length} {displayedSongs.length === 1 ? "Song" : "Songs"}</p>
<ul class="card divide-y divide-surface-800 bg-surface-950">
    {#each displayedSongs as song (song.id)}
    <li>
        <a class="px-4 py-2 flex items-center gap-2" href={`songs/${song.id}`}>
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