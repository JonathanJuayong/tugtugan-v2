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
            tags: string[];
        }[]
        tags: Set<string>
    }


    let {songs, tags}: Props = $props()
    let search = $state('')
    let activeTags: Set<string> = $state(new Set())
    let inactiveTags = $derived(tags.difference(activeTags))
    let taggedSongs = $derived.by(() => {
        return songs.filter(song => {
            const tagsArray = [...activeTags]
            return tagsArray.every(tag => song.tags.includes(tag))
        })
    })
    let displayedSongs = $derived.by(() => {
        const query = search.toLowerCase().trim()
        if (query === '') return taggedSongs

        return taggedSongs.filter(song => {
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

    function activateTag(tag: string) {
        return (e: Event) => {
            e.preventDefault()
            console.log("clicked ", tag)
            page = 1
            activeTags = new Set([...activeTags, tag])
        }
    }

    function deactivateTag(tag: string) {
        return (e: Event) => {
            e.preventDefault()
            console.log("clicked ", tag)
            activeTags.delete(tag)
            page = 1
            activeTags = new Set([...activeTags])
        }
    }

    $inspect(activeTags)
</script>

<form class="space-y-4">
    <label class="label" for="search">
        <span class="label-text">Search</span>
        <input oninput={() => page = 1} bind:value={search} id="search" type="text" autocomplete="off"
               placeholder="Search for any artist or song" name="search" class="input"/>
    </label>
    <section class="grid gap-4">
        <h2 class="preset-typo-caption">Tags:</h2>
        <ul class="flex gap-2 flex-wrap">
            {#each inactiveTags as tag}
                <li>
                    <button onclick={activateTag(tag)} class="chip preset-outlined-brand">{tag}</button>
                </li>
            {/each}
        </ul>
        <ul class="flex gap-2 flex-wrap">
            {#each activeTags as tag}
                <li>
                    <button onclick={deactivateTag(tag)} class="chip preset-filled">{tag}</button>
                </li>
            {/each}
        </ul>
    </section>
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
{:else if viewBy === "Artists"}
    <ViewByArtists songs={displayedSongs}/>
{/if}

