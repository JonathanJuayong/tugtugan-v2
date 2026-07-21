<script lang="ts">
    import {ChordLyricsPair, UltimateGuitarParser} from "chordsheetjs";

    let { chords }: { chords: string } = $props()
    let highlightedItem = $state<HTMLElement | null>(null)

    const parser = new UltimateGuitarParser()
    let lines = $derived.by(() => {
        const song = parser.parse(chords)
        return song.bodyLines.map(((line) => {
            if (line.type === "none") {
                return [{
                    itemNumber: 0,
                    chords: '',
                    lyrics: '',
                }]
            }

            return line.items.map((item, itemNumber) => {
                if (item instanceof ChordLyricsPair) {
                    const {chords, lyrics} = item

                    const lyricsIsEmpty = !lyrics
                    const chordsIsEmpty = chords.trim().length === 0

                    return {
                        itemNumber: itemNumber + 1,
                        chords: chordsIsEmpty ? '' : chords,
                        lyrics: lyricsIsEmpty ? '' : lyrics,
                    }
                }

                return {
                    itemNumber: 0,
                    chords: '',
                    lyrics: '',
                }
            })
        })).filter((line) => line.length > 0)
    })

    function onclick(e: Event) {
        const target = e.target
        const highlight = ['bg-primary-700', 'text-surface-900']
        if (!(target instanceof HTMLElement)) return

        const item = target.closest('pre');
        if (!highlightedItem) {
            highlightedItem = item
            item?.classList.add(...highlight)
            return
        }

        highlightedItem.classList.remove(...highlight)
        item?.classList.add(...highlight)
        highlightedItem = item

    }
</script>

<div>
    {#each lines as line, i}
        <div id={`${i + 1}`} class="flex flex-wrap justify-items-start align-text-bottom gap-1 text-xs">
            {#each line as item}
                {#if item.itemNumber === 0}
                <pre id={`${i + 1}-0`}>

                </pre>
                {:else if item.chords === ''}
                    <pre class="grid content-end transition-all" id={`${i + 1}-${item.itemNumber}`}><button {onclick} class="whitespace-nowrap cursor-pointer">{item.lyrics}</button></pre>
                {:else if item.lyrics === ''}
                    <pre data-chord={item.chords} class="grid content-start transition-all" id={`${i + 1}-${item.itemNumber}`}><button
                        {onclick} class="whitespace-nowrap cursor-pointer">{item.chords}</button></pre>
                {:else}
                    <pre class="transition-all" data-chord={item.chords} id={`${i + 1}-${item.itemNumber}`}><button {onclick} class="grid whitespace-nowrap cursor-pointer">
                        <span>{item.chords}</span>
                        <span>{item.lyrics}</span>
                    </button></pre>
                {/if}
            {/each}
        </div>
    {/each}
</div>
