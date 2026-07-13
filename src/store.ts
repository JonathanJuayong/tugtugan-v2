import {atom} from "nanostores";
import {Song} from "chordsheetjs";

const $chordText = atom<Song | null>(null)

export function setSong(song: Song) {
    $chordText.set(song)
}

export function getSong() {
    return $chordText.get()
}

export function subscribeToSong(callback: (newValue: Readonly<Song> | null, oldValue?: Readonly<Song> | null | undefined) => void) {
    $chordText.subscribe(callback)
}

const $highlightedItem = atom<{line: number | null, item: number | null}>({
    line: null,
    item: null,
})

export function setHighlightedItem(line: number, item: number) {
    const newItem = {line, item}
    $highlightedItem.set(newItem)
}

export function getCurrentHighlightedItem() {
    return $highlightedItem.get()
}

export function subscribeToHighlightedItem(callback: (newValue: Readonly<{line: number | null, item: number | null}>, oldValue?: Readonly<{line: number | null, item: number | null}>) => void) {
    return $highlightedItem.subscribe(callback)
}