<script lang="ts">
    import {SegmentedControl} from "@skeletonlabs/skeleton-svelte";
    import ViewBySongs from "./ViewBySongs.svelte";
    import ViewByArtists from "./ViewByArtists.svelte";

    interface Props {
        songs: {
            id: string;
            artist: string;
            title: string;
        }[]
    }

    let {songs}: Props = $props()
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

    let viewBy = $state<'Songs' | 'Artists'>('Songs')

    function onValueChange(target: { value: string | null }) {
        viewBy = target.value as "Songs" | "Artists"
    }

</script>

<form class="space-y-4">
    <label class="label" for="search">
        <span class="label-text">Search</span>
        <input bind:value={search} id="search" type="text" autocomplete="off"
               placeholder="Search for any artist or song" name="search" class="input"/>
    </label>
    <SegmentedControl value={viewBy} {onValueChange}>
        <SegmentedControl.Label>View by:</SegmentedControl.Label>
        <SegmentedControl.Control class="bg-surface-950">
            <SegmentedControl.Indicator/>
            <SegmentedControl.Item value='Songs'>
                <SegmentedControl.ItemText>Songs</SegmentedControl.ItemText>
                <SegmentedControl.ItemHiddenInput/>
            </SegmentedControl.Item>
            <SegmentedControl.Item value='Artists'>
                <SegmentedControl.ItemText>Artists</SegmentedControl.ItemText>
                <SegmentedControl.ItemHiddenInput/>
            </SegmentedControl.Item>
        </SegmentedControl.Control>
    </SegmentedControl>
</form>
<p class="preset-typo-caption">{displayedSongs.length} {displayedSongs.length === 1 ? "Song" : "Songs"}</p>

{#if viewBy === "Songs"}
    <ViewBySongs songs={displayedSongs}/>
{:else if viewBy === "Artists"}
    <ViewByArtists songs={displayedSongs}/>
{/if}