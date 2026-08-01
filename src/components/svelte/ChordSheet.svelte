<script lang="ts">
    import {ChordLyricsPair, UltimateGuitarParser} from "chordsheetjs";
    import ChordSheetLineItem from "./ChordSheetLineItem.svelte";
    import type {ChordItem} from "../../utils/types.ts";
    import ChordSheetControls from "./ChordSheetControls.svelte";
    import ChordSheetInstrumentGuitar from "./ChordSheetInstrumentGuitar.svelte";

    let {chords}: { chords: string } = $props()
    let currentHighlightedItem = $state({
        line: -1,
        item: -1
    })

    let isGuitarActive = $state(false)
    let transposeLevel = $state(0)

    let song = $derived.by(() => {
        const parser = new UltimateGuitarParser()
        const parsed = parser.parse(chords)
        return parsed.transpose(transposeLevel)
    })

    let lines: ChordItem[][] = $derived.by(() => {
        return song.bodyLines.map(((line, lineNumber) => {
            return line.items.map((item, itemNumber) => {
                const isHighlighted = currentHighlightedItem.line === lineNumber && currentHighlightedItem.item === itemNumber

                if (item instanceof ChordLyricsPair) {
                    const {chords, lyrics} = item

                    const lyricsIsEmpty = !lyrics || lyrics.trim().length === 0
                    const chordsIsEmpty = chords.trim().length === 0


                    return {
                        isHighlighted: isHighlighted,
                        lineNumber: lineNumber,
                        itemNumber: itemNumber,
                        chords: chordsIsEmpty ? '' : chords,
                        lyrics: lyricsIsEmpty ? '' : lyrics,
                    }
                }

                return {
                    isHighlighted: isHighlighted,
                    lineNumber: lineNumber,
                    itemNumber: -1,
                    chords: '',
                    lyrics: '',
                }
            })
        }))

    })

    let currentChord = $derived.by(() => {
        const {line, item} = currentHighlightedItem
        if (line === -1) return null
        const chordItem = lines[line][item]
        return chordItem.chords
    })

    $effect(() => {
        const {line, item} = currentHighlightedItem
        const highlightedElement = document.getElementById(`${line}-${item}`)

        if (!highlightedElement) return

        highlightedElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'center',
        })
    })

</script>

<ChordSheetControls
        bind:currentHighlightedItem={currentHighlightedItem}
        bind:transposeLevel={transposeLevel}
        {currentChord}
        {lines}
        classList="flex flex-wrap items-center justify-between sticky top-4 border bg-surface-100 dark:border-0 dark:bg-surface-950 py-2 px-4 rounded-xl mb-6"
/>
<div class="overflow-scroll">
    {#each lines as line}
        {#if line.length > 0}
            <div id={`${line[0].lineNumber}`}
                 class="flex flex-wrap justify-items-start align-text-bottom gap-1 text-xs">
                {#each line as item (item.itemNumber)}
                    <ChordSheetLineItem {item} bind:currentHighlightedItem={currentHighlightedItem}/>
                {/each}
            </div>
        {/if}
    {/each}
</div>
