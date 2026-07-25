<script lang="ts">
    import type {ChordItem} from "../../utils/types.ts";

    interface Props {
        item: ChordItem
        currentHighlightedItem: {
            line: number,
            item: number
        }
    }
    let {item, currentHighlightedItem = $bindable()}: Props = $props()
    const id = $derived(`${item.lineNumber}-${item.itemNumber}`)

    const highlight = 'bg-primary-700 text-surface-900 font-bold'

    function onclick(e: Event) {
        const target = e.target
        if (!(target instanceof HTMLElement)) return

        const preElement = target.closest('pre');
        if (!preElement) return;

        const [newLine, newItem] = preElement.id.split('-').map((id) => parseInt(id))
        const {line, item} = currentHighlightedItem

        console.log({line, item, newLine, newItem})
        const isSameItem = line === newLine && item === newItem;
        if (isSameItem) {
            currentHighlightedItem = {
                line: -1,
                item: -1
            }
            return
        }

        currentHighlightedItem = {
            line: newLine,
            item: newItem
        }
    }

</script>

{#if item.itemNumber === -1}
    <pre {id}>

    </pre>
{:else if item.chords === '' && item.lyrics.length > 0}
    <pre class={["grid content-end transition-all", item.isHighlighted ? highlight : '']} {id}><button {onclick} class={"whitespace-nowrap cursor-pointer"}>{item.lyrics}</button></pre>
{:else if item.lyrics === '' && item.chords.length > 0}
    <pre data-chord={item.chords} class={["grid content-start transition-all", item.isHighlighted ? highlight : '']} {id}><button {onclick} class="whitespace-nowrap cursor-pointer">{item.chords}</button></pre>
{:else}
    <pre class={["transition-all", item.isHighlighted ? highlight : '']} data-chord={item.chords} {id}><button {onclick} class="grid whitespace-nowrap cursor-pointer">
        <span>{item.chords}</span>
        <span>{item.lyrics}</span>
    </button></pre>
{/if}