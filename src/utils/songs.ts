export function getYoutubeEmbed(body: string) {
    const match = body.match(/<iframe[\s\S]*?<\/iframe>/i);
    return match ? match[0] : null;
}

export function getUrlFromIframe(iframe: string) {
    const match = iframe.match(/src="([^"]+)"/i);
    return match ? match[1] : null;
}

export function getChords(body: string) {
    const match = body.match(/```(?:\w+)?\n([\s\S]*?)```/);
    return match ? match[1].trim() : null;
}

export function getRandomSongs<T>(count: number, songs: T[]) {
    const shuffled = [...songs];

    // Fisher-Yates shuffle algorithm
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    // Return the first n elements
    return shuffled.slice(0, count);
}
