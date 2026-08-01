import * as Tone from 'tone'
import guitarJson from '@tombatossals/chords-db/lib/guitar.json'
import {Chord} from 'chordsheetjs'

export const defaultOpenStringNotes = {
    e: 40,
    a: 45,
    d: 50,
    g: 55,
    b: 59,
    E: 64,
}

export function createSampleUrls(
    startMidiNote: number,
    endMidiNote: number,
    fileExtension: string = "mp3"
) {
    const sampleUrls: Record<string, string> = {}

    for (let i = startMidiNote; i <= endMidiNote; i++) {
        sampleUrls[i] = `${i}.${fileExtension}`
    }

    return sampleUrls
}

export class VoicePool {
    voices: Tone.Player[];
    index = 0

    constructor(url: string, size: number, onload?: () => void) {
        this.voices = Array.from({length: size}, () => {
            return new Tone.Player({url, onload}).toDestination()
        })
    }

    play() {
        const voice = this.voices[this.index]
        voice.start()
        this.index = (this.index + 1) % this.voices.length
    }

    dispose() {
        this.voices.forEach((voice) => voice.dispose())
    }
}

const noteReplacements = {
    "A": "A",
    "B": "B",
    "C": "C",
    "D": "D",
    "E": "E",
    "F": "F",
    "G": "G",
    "A#": "Bb",
    "B#": "C",
    "C#": "C#",
    "D#": "Eb",
    "E#": "F",
    "F#": "F#",
    "G#": "Ab",
    "Ab": "Ab",
    "Bb": "Bb",
    "Cb": "B",
    "Db": "C#",
    "Eb": "Eb",
    "Fb": "E",
    "Gb": "F#",
}

export function getMidiNotesFromChord(chord: string | null): typeof defaultOpenStringNotes {
    if (!chord) {
        return defaultOpenStringNotes
    }
    const parsedChord = Chord.parse(chord)

    const rootString = noteReplacements[parsedChord?.root?.note as keyof typeof noteReplacements];
    const rootHasSharp = rootString?.includes("#")
    const root = rootHasSharp ?
        replaceSharpSymbolFromChord(parsedChord) :
        rootString
    const chordQuality = parsedChord?.quality ?? ""
    const chordExtension = parsedChord?.extensions ?? ""
    const chordBass = parsedChord?.bass?.note

    if (root) {
        const hasExtension = chordExtension !== ""
        const isOnlyMinor = !hasExtension && chordQuality === "m"
        const isOnlyMajor = !hasExtension && chordQuality === ""
        const isSlashChord = !!chordBass


        const chordsList = guitarJson.chords[root as keyof typeof guitarJson.chords]

        const chord = chordsList.find(chord => {
            if (isSlashChord) {
                const s = `${chordQuality}${chordExtension}/${chordBass}`;
                return chord.suffix === s
            }

            if (isOnlyMinor) {
                return chord.suffix === "minor"
            }

            if (isOnlyMajor) {
                return chord.suffix === "major"
            }

            return chord.suffix === `${chordQuality}${chordExtension}`
        })


        const [e, a, d, g, b, E] = chord?.positions[0].midi ?? Object.values(defaultOpenStringNotes)

        return {
            e,
            a,
            d,
            g,
            b,
            E
        }
    }

    return defaultOpenStringNotes
}

function replaceSharpSymbolFromChord(chord: Chord | null) {
    return noteReplacements[chord?.root?.note as keyof typeof noteReplacements].replace("#", "sharp")
}
