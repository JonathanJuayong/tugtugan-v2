<script lang="ts">
    import {ChevronLeftIcon, ChevronRightIcon, MinusIcon, PlusIcon} from "@lucide/svelte";
    import type {ChordItem} from "../../utils/types.ts";

    interface Props {
        currentHighlightedItem: {
            line: number
            item: number
        }
        transposeLevel: number
        lines: ChordItem[][]
        classList?: string
    }

    let {
        currentHighlightedItem = $bindable(),
        transposeLevel = $bindable(),
        lines,
        classList = ""
    }: Props = $props()

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
</div>