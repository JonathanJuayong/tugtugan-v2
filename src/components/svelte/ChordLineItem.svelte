<script lang="ts">
    interface Props {
        item: {
            highlighted: boolean
            lineNumber: number
            itemNumber: number
            chords: string
            lyrics: string
        }
        onclick: (e: Event) => void
    }
    const {item, onclick}: Props = $props()
    const id = $derived(`${item.lineNumber}-${item.itemNumber}`)

    const highlight = 'bg-primary-700 text-surface-900 font-bold'
</script>

{#if item.itemNumber === -1}
    <pre {id}>

    </pre>
{:else if item.chords === '' && item.lyrics.length > 0}
    <pre class={["grid content-end transition-all", item.highlighted ? highlight : '']} {id}><button {onclick} class={"whitespace-nowrap cursor-pointer"}>{item.lyrics}</button></pre>
{:else if item.lyrics === '' && item.chords.length > 0}
    <pre data-chord={item.chords} class={["grid content-start transition-all", item.highlighted ? highlight : '']} {id}><button {onclick} class="whitespace-nowrap cursor-pointer">{item.chords}</button></pre>
{:else}
    <pre class={["transition-all", item.highlighted ? highlight : '']} data-chord={item.chords} {id}><button {onclick} class="grid whitespace-nowrap cursor-pointer">
        <span>{item.chords}</span>
        <span>{item.lyrics}</span>
    </button></pre>
{/if}