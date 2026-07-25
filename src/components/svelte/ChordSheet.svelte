<script lang="ts">
    import {ChordLyricsPair, UltimateGuitarParser} from "chordsheetjs";
    import {ChevronLeftIcon, ChevronRightIcon, MinusIcon, PlusIcon} from "@lucide/svelte";
    import ChordSheetLineItem from "./ChordSheetLineItem.svelte";
    import type {ChordItem} from "../../utils/types.ts";

    let { chords }: { chords: string } = $props()
    let currentHighlightedItem = $state({
        line: -1,
        item: -1
    })

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

    $effect(() => {
        const {line, item} = currentHighlightedItem
        const highlightedElement = document.getElementById(`${line}-${item}`)

        if (!highlightedElement) return

        console.log(highlightedElement)

        highlightedElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'center',
        })
    })

    function previousItem() {
        const {line, item} = currentHighlightedItem

        if (line === -1 || item === -1) return

        if (item > 0) {
            currentHighlightedItem = {
                line,
                item: item - 1
            }
            return
        }

        let index = line - 1
        while (true) {
            const previousLine = lines[index];
            if (!previousLine) break

            const previousLineLength = previousLine.length;

            const lineIsInvalid = previousLineLength === 0 || previousLine.some((line) => line.itemNumber === -1)
            if (lineIsInvalid) {
                index -= 1
                continue
            }

            currentHighlightedItem = {
                line: index,
                item: previousLineLength - 1
            }
            break
        }
    }

    function nextItem() {
        const {line, item} = currentHighlightedItem

        const currentLine = lines[line]

        if (item < currentLine.length - 1) {
            currentHighlightedItem = {
                line,
                item: item + 1
            }
            return
        }

        let index = line + 1
        while (true) {
            const nextLine = lines[index];
            if (!nextLine) break

            const nextLineLength = nextLine.length;

            const lineIsInvalid = nextLineLength === 0 || nextLine.some((line) => line.itemNumber === -1)
            if (lineIsInvalid) {
                index += 1
                continue
            }

            currentHighlightedItem = {
                line: index,
                item: 0
            }
            break
        }
    }

    const MUSICAL_NOTES = 12
    function transposeUp() {
        if (transposeLevel === MUSICAL_NOTES - 1) {
            return transposeLevel = 0
        }
        transposeLevel += 1
    }

    function transposeDown() {
        if (Math.abs(transposeLevel) === MUSICAL_NOTES - 1) {
            return transposeLevel = 0
        }
        transposeLevel -= 1
    }

</script>
<div class="relative">
    <div class="flex items-center sticky top-4 lg:top-0 bg-surface-950 py-2 px-4 rounded-xl">
        <div class="flex items-center gap-2">
            <p class="preset-typo-caption uppercase">Transpose Song: </p>
            <button onclick={transposeDown} title="Transpose Down" aria-label="Transpose Down" class="btn btn-icon-2xl cursor-pointer">
                <MinusIcon />
            </button>
            <p>{transposeLevel}</p>
            <button onclick={transposeUp} title="Transpose Up" aria-label="Transpose Up" class="btn btn-icon-2xl cursor-pointer">
                <PlusIcon />
            </button>
        </div>
        <div class="flex items-center gap-2 ml-auto">
            <p class="preset-typo-caption uppercase">Navigate: </p>
            <button onclick={previousItem} title="Previous Item" aria-label="Previous Item" class="btn btn-icon-2xl cursor-pointer">
                <ChevronLeftIcon />
            </button>
            <button onclick={nextItem} title="Next Item" aria-label="Next Item" class="btn btn-icon-2xl cursor-pointer">
                <ChevronRightIcon />
            </button>
        </div>
    </div>
    <div>
        {#each lines as line}
            {#if line.length > 0}
                <div id={`${line[0].lineNumber}`} class="flex flex-wrap justify-items-start align-text-bottom gap-1 text-xs">
                    {#each line as item (item.itemNumber)}
                        <ChordSheetLineItem {item} bind:currentHighlightedItem={currentHighlightedItem} />
                    {/each}
                </div>
            {/if}
        {/each}
    </div>
</div>
