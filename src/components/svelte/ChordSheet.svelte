<script lang="ts">
    import {ChordLyricsPair, UltimateGuitarParser} from "chordsheetjs";
    import {ChevronLeftIcon, ChevronRightIcon, PlusIcon, MinusIcon} from "@lucide/svelte";

    let { chords }: { chords: string } = $props()
    let currentItemNumbers = $state({
        line: 0,
        item: 0
    })
    let currentHighlightedItem = $derived.by(() => {
        return document.getElementById(`${currentItemNumbers.line}-${currentItemNumbers.item}`)
    })
    let previousHighlightedItem = $state<typeof currentHighlightedItem>(null)

    let transposeLevel = $state(0)

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

                    const lyricsIsEmpty = !lyrics || lyrics.trim().length === 0
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
        }))
            .filter((line) => line.length > 0)
    })

    $effect(() => {
        const highlight = ['bg-primary-700', 'text-surface-900', 'font-bold']
        if (previousHighlightedItem) {
            previousHighlightedItem.classList.remove(...highlight)
        }

        if (!currentHighlightedItem) return

        currentHighlightedItem.classList.add(...highlight)
        currentHighlightedItem.scrollIntoView({behavior: 'smooth', block: 'center', inline: 'center'})
    })


    function onclick(e: Event) {
        const target = e.target
        if (!(target instanceof HTMLElement)) return

        const preElement = target.closest('pre');
        if (!preElement) return;

        previousHighlightedItem = currentHighlightedItem

        const [newLine, newItem] = preElement.id.split('-').map((id) => parseInt(id))
        const {line, item} = currentItemNumbers

        if (newLine === line && newItem === item) {
            currentItemNumbers = {
                line: 0,
                item: 0
            }
            return
        }

        currentItemNumbers = {
            line: newLine,
            item: newItem
        }
    }

    function previousItem() {
        const {line, item} = currentItemNumbers

        if (!currentHighlightedItem) return

        const previousSibling = currentHighlightedItem.previousElementSibling

        if (line === 1 && item === 1) return
        if (previousSibling) {
            previousHighlightedItem = currentHighlightedItem
            currentItemNumbers = {
                line,
                item: item - 1
            }
            return
        }

        let previousLine = currentHighlightedItem.parentElement?.previousElementSibling
        while (true) {
            if (!previousLine) break
            const previousLineChildren = [...previousLine.children];
            const containsEmptyLine = previousLineChildren.some((e) => {
                const [_, item] = e.id.split('-').map((id) => parseInt(id))
                return item === 0
            });

            if (!containsEmptyLine) {
                previousHighlightedItem = currentHighlightedItem
                currentItemNumbers = {
                    line: parseInt(previousLine.id),
                    item: previousLineChildren.length
                }
                break
            }

            previousLine = previousLine.previousElementSibling
        }
    }

    function nextItem() {
        const {line, item} = currentItemNumbers
        const nextSibling = currentHighlightedItem?.nextElementSibling

        if (!currentHighlightedItem) return

        if (line === 1 && item === 1) return
        if (nextSibling) {
            previousHighlightedItem = currentHighlightedItem
            currentItemNumbers = {
                line,
                item: item + 1
            }
            return
        }
        let nextLine = currentHighlightedItem.parentElement?.nextElementSibling
        while (true) {
            if (!nextLine) break
            const nextLineChildren = [...nextLine.children];
            const containsEmptyLine = nextLineChildren.some((e) => {
                const [_, item] = e.id.split('-').map((id) => parseInt(id))
                return item === 0
            });

            if (!containsEmptyLine) {
                previousHighlightedItem = currentHighlightedItem
                currentItemNumbers = {
                    line: parseInt(nextLine.id),
                    item: 1
                }
                break
            }

            nextLine = nextLine.nextElementSibling
        }
    }

</script>
<div class="relative">
    <div class="flex items-center sticky top-0 bg-surface-950 py-2 px-4 rounded-xl">
        <div class="flex items-center gap-2">
            <p class="preset-typo-caption uppercase">Transpose Song: </p>
            <button title="Transpose Down" aria-label="Transpose Down" class="btn btn-icon-2xl cursor-pointer">
                <MinusIcon />
            </button>
            <p>{transposeLevel}</p>
            <button title="Transpose Up" aria-label="Transpose Up" class="btn btn-icon-2xl cursor-pointer">
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
    <div class="container">
        {#each lines as line, i}
            <div id={`${i + 1}`} class="flex flex-wrap justify-items-start align-text-bottom gap-1 text-xs">
                {#each line as item}
                    {#if item.itemNumber === 0}
                        <pre id={`${i + 1}-${0}`}>

                        </pre>
                    {:else if item.chords === '' && item.lyrics.length > 0}
                        <pre class="grid content-end transition-all" id={`${i + 1}-${item.itemNumber}`}><button {onclick} class="whitespace-nowrap cursor-pointer">{item.lyrics}</button></pre>
                    {:else if item.lyrics === '' && item.chords.length > 0}
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
</div>
