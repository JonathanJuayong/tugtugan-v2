import {atom} from "nanostores";
import {Song} from "chordsheetjs";

export const $chordText = atom<Song | null>(null)

export function setSong(song: Song) {
    $chordText.set(song)
}

export function getSong() {
    return $chordText.get()
}

export function subscribeToSong(callback: (newValue: Readonly<Song> | null, oldValue?: Readonly<Song> | null | undefined) => void) {
    $chordText.subscribe(callback)
}