<script lang="ts">
    import {ChevronLeftIcon, ChevronRightIcon, MinusIcon, PlusIcon, GuitarIcon, XIcon} from "@lucide/svelte";
    import type {ChordItem} from "../../utils/types.ts";
    import ChordSheetInstrumentGuitar from "./ChordSheetInstrumentGuitar.svelte";

    interface Props {
        currentHighlightedItem: {
            line: number
            item: number
        }
        transposeLevel: number
        lines: ChordItem[][]
        classList?: string
        currentChord: string | null
    }

    let {
        currentHighlightedItem = $bindable(),
        transposeLevel = $bindable(),
        lines,
        classList = "",
        currentChord
    }: Props = $props()

    let isGuitarActive = $state(false)

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

        // if no highlighted item, highlight first chord lyric pair
        const noHighlightedItem = line === -1 && item === -1
        if (noHighlightedItem) {
            const firstValidLine = lines.findIndex((line) => {
                return line.some((item) => {
                    return item.itemNumber !== -1
                })
            })

            currentHighlightedItem = {
                line: firstValidLine,
                item: 0
            }
            return
        }

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

    function toggleGuitar() {
        isGuitarActive = !isGuitarActive
    }
</script>

<div class={classList}>
    <div class="flex items-center gap-2">
        <p class="preset-typo-caption uppercase hidden sm:block">Transpose Song: </p>
        <button onclick={transposeDown} title="Transpose Down" aria-label="Transpose Down"
                class="btn btn-icon-2xl cursor-pointer">
            <MinusIcon/>
        </button>
        <p>{transposeLevel}</p>
        <button onclick={transposeUp} title="Transpose Up" aria-label="Transpose Up"
                class="btn btn-icon-2xl cursor-pointer">
            <PlusIcon/>
        </button>
    </div>
    <span class="vr block sm:hidden"></span>
    <div class="flex items-center gap-2">
        <p class="preset-typo-caption uppercase hidden sm:block">Navigate: </p>
        <button onclick={previousItem} title="Previous Item" aria-label="Previous Item"
                class="btn btn-icon-2xl cursor-pointer">
            <ChevronLeftIcon/>
        </button>
        <button onclick={nextItem} title="Next Item" aria-label="Next Item" class="btn btn-icon-2xl cursor-pointer">
            <ChevronRightIcon/>
        </button>
    </div>
    <button onclick={toggleGuitar} class="btn btn-icon-2xl p-3 border-2 border-brand-contrast-dark dark-border-4 bg-brand-light dark:bg-brand-dark rounded-full cursor-pointer fixed bottom-5 right-5 sm:relative sm:inset-0">
        <GuitarIcon class="text-brand-contrast-dark"/>
    </button>
</div>



{#if isGuitarActive}
    <div class="fixed grid bottom-0 left-0 right-0 rounded-b-none container narrow card py-4 bg-surface-100 dark:border-0 dark:bg-surface-contrast-dark touch-none">
        <button title="Close Guitar" aria-label="Close Guitar" class="btn btn-icon justify-self-end" onclick={() => isGuitarActive = false}>
            <XIcon/>
        </button>
        <ChordSheetInstrumentGuitar {currentChord} />
        <div class="flex justify-between items-center gap-2">
            <button onclick={previousItem} title="Previous Item" aria-label="Previous Item"
                    class="btn btn-icon-2xl cursor-pointer">
                <ChevronLeftIcon/>
            </button>
            <p class="font-black">{currentChord ? currentChord : "No Chord Selected"}</p>
            <button onclick={nextItem} title="Next Item" aria-label="Next Item" class="btn btn-icon-2xl cursor-pointer">
                <ChevronRightIcon/>
            </button>
        </div>
    </div>
{/if}