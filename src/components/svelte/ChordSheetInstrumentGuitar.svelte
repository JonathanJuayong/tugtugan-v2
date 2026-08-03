<script lang="ts">
    import {
        createSampleUrls,
        getMidiNotesFromChord,
        VoicePool
    } from "../../utils/instruments.ts";
    import * as Tone from "tone";
    import {onDestroy, onMount} from "svelte";

    interface Props {
        currentChord: string | null
    }

    const baseUrl = "/guitar/notes/"
    const guitarSamples = createSampleUrls(40, 76)

    let {currentChord}: Props = $props()

    let isLoaded = $state(false)
    let isStarted = $state(false)
    let chordMidNotes = $derived(getMidiNotesFromChord(currentChord))

    let lastString: 'e' | 'a' | 'd' | 'g' | 'b' | 'E' | null = $state(null)

    $inspect(chordMidNotes)

    const VOICES_PER_NOTE = 12
    let pools: Record<string, VoicePool> = {}
    onMount(() => {

        const context = new Tone.Context({latencyHint: "interactive", lookAhead: 0})
        Tone.setContext(context)

        let loadedSamples = 0
        const totalSamples = Object.keys(guitarSamples).length

        Object.entries(guitarSamples).forEach(([midi, fileName]) => {
            pools[midi] = new VoicePool(
                `${baseUrl}/${fileName}`,
                VOICES_PER_NOTE,
                () => {
                    loadedSamples++
                    if(loadedSamples === totalSamples) isLoaded = true
                }
            )
        })
    })

    onDestroy(() => {
        Object.values(pools).forEach(pool => pool.dispose())
    })

    async function ensureAudioStarted() {
        if (!isStarted) {
            await Tone.start()
            isStarted = true
        }
    }

    function playMidiNote(midi: string) {
        if (!isStarted) {
            ensureAudioStarted().then(() => pools[midi]?.play())
            return
        }

        pools[midi]?.play()
    }

    function getNearestString(e: PointerEvent) {
        const element = document.elementFromPoint(e.x, e.y)
        const string = element?.closest("[data-note]") as HTMLElement | null
        if (string) {
            return (string.dataset?.note ?? null) as typeof lastString
        }

        return null
    }

    function onpointerdown(e: PointerEvent) {
        e.preventDefault()
        console.log("pointerDown")
        lastString = null
        onpointermove(e)
    }
    function onpointermove(e: PointerEvent) {
        e.preventDefault()
        console.log("pointerMove")
        const string = getNearestString(e)
        console.log("index", string)
        if (string && lastString !== string) {
            lastString = string
            playMidiNote(`${chordMidNotes[string]}`)
        }
    }
    function onpointerup(e: PointerEvent) {
        e.preventDefault()
        console.log("pointerUp")
        lastString = null
    }

</script>

<div class="">
    <p class="text-center">Strum the strings below to play the guitar.</p>

    {#if isLoaded}
        <div {onpointerdown} {onpointerup} {onpointermove} role="application" class="flex justify-around mx-auto">
            <p data-note="e" class="pt-6 px-2 grid place-items-center"><span class="outline-1 h-20"></span>  e</p>
            <p data-note="a" class="pt-6 px-2 grid place-items-center"><span class="outline-1 h-20"></span>  a</p>
            <p data-note="d" class="pt-6 px-2 grid place-items-center"><span class="outline-1 h-20"></span>  d</p>
            <p data-note="g" class="pt-6 px-2 grid place-items-center"><span class="outline-1 h-20"></span>  g</p>
            <p data-note="b" class="pt-6 px-2 grid place-items-center"><span class="outline-1 h-20"></span>  b</p>
            <p data-note="E" class="pt-6 px-2 grid place-items-center"><span class="outline-1 h-20"></span>  E</p>
        </div>
    {:else}
        <div class="flex justify-center">
            <Progress class="items-center w-fit" value={null}>
                <Progress.Circle>
                    <Progress.CircleTrack />
                    <Progress.CircleRange />
                </Progress.Circle>
                <Progress.ValueText>
                    <p>Loading guitar samples</p>
                </Progress.ValueText>
            </Progress>
        </div>
    {/if}


</div>

