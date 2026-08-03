<script lang="ts">
    import {SegmentedControl} from "@skeletonlabs/skeleton-svelte";
    import ViewBySongs from "./ViewBySongs.svelte";
    import ViewByArtists from "./ViewByArtists.svelte";
    import {Pagination} from "@skeletonlabs/skeleton-svelte";
    import {ArrowLeftIcon, ArrowRightIcon} from "@lucide/svelte"

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

    const PAGE_SIZE = 6
    let page = $state(1)
    let start = $derived((page - 1) * PAGE_SIZE)
    let end = $derived(start + PAGE_SIZE)
    let paginatedItems = $derived(displayedSongs.slice(start, end))

    function onValueChange(target: { value: string | null }) {
        viewBy = target.value as "Songs" | "Artists"
    }

</script>

<form class="space-y-4">
    <label class="label" for="search">
        <span class="label-text">Search</span>
        <input oninput={() => page = 1} bind:value={search} id="search" type="text" autocomplete="off"
               placeholder="Search for any artist or song" name="search" class="input"/>
    </label>
    <SegmentedControl value={viewBy} {onValueChange}>
        <SegmentedControl.Label>View by:</SegmentedControl.Label>
        <SegmentedControl.Control class="dark:bg-surface-950 ">
            <SegmentedControl.Indicator class="bg-brand-contrast-light dark:bg-surface-50"/>
            <SegmentedControl.Item value='Songs'>
                <SegmentedControl.ItemText class=" ">Songs</SegmentedControl.ItemText>
                <SegmentedControl.ItemHiddenInput/>
            </SegmentedControl.Item>
            <SegmentedControl.Item value='Artists'>
                <SegmentedControl.ItemText class=" ">Artists</SegmentedControl.ItemText>
                <SegmentedControl.ItemHiddenInput/>
            </SegmentedControl.Item>
        </SegmentedControl.Control>
    </SegmentedControl>
</form>
<p class="preset-typo-caption">{displayedSongs.length} {displayedSongs.length === 1 ? "Song" : "Songs"}</p>

{#if viewBy === "Songs"}
    <ViewBySongs songs={paginatedItems} />
{:else if viewBy === "Artists"}
    <ViewByArtists songs={displayedSongs}/>
{/if}

<div class="grid w-full place-items-center">
    <Pagination siblingCount={0} count={displayedSongs.length} pageSize={PAGE_SIZE} {page} onPageChange={(e) => (page = e.page)}>
        <Pagination.PrevTrigger>
            <ArrowLeftIcon />
        </Pagination.PrevTrigger>
        <Pagination.Context>
            {#snippet children(pagination)}
                <div class="flex flex-wrap gap-1 items-start justify-start">
                    {#each pagination().pages as page, index (page)}
                        {#if page.type === "page"}
                            <Pagination.Item {...page}>
                                {page.value}
                            </Pagination.Item>
                        {:else}
                            <Pagination.Ellipsis {index}>
                                &#8230;
                            </Pagination.Ellipsis>
                        {/if}
                    {/each}
                </div>
            {/snippet}
        </Pagination.Context>
        <Pagination.NextTrigger>
            <ArrowRightIcon />
        </Pagination.NextTrigger>
    </Pagination>
</div>
