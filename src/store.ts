import {atom} from "nanostores";

export const $chordText = atom("")

export function setChordText(text: string) {
    $chordText.set(text)
}

export function getChordText() {
    return $chordText.get()
}

export function subscribeToChordText(callback: (newValue: string, oldValue?: string | undefined) => void) {
    $chordText.subscribe(callback)
}