export default function getAtlas(characterWidth, characterHeight, gapBetweenCharacters, numCharacters) {
    let frames = [];

    for (let i = 0; i < numCharacters; i++) {
        let filename = `frame${i + 1}.png`;
        let x = i * (characterWidth + gapBetweenCharacters);
        let y = 0;
        let w = characterWidth;
        let h = characterHeight;

        let frame = { filename, frame: { x, y, w, h } };
        frames.push(frame);
    }

    return { frames };
}