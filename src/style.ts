import { Icon, Stroke } from 'ol/style';

export function getStyle(letter: string, selected: boolean) {
    return letter ? {
        image: new Icon({
            anchor: [0.5, 0.9],
            src: createPointerMarkerSrc(
                selected ? '#f00' : letter === 'D' ? '#0f0' : '#00f',
                selected ? 64 : 48,
                letter
            )
        })
    } : {
        stroke: new Stroke({
            color: selected ? '#f00' : '#00f',
            width: selected ? 3 : 2
        })
    };
}
function createPointerMarkerSrc(color: string, size: number, letter?: string) {
    return 'data:image/svg+xml;base64,' + btoa(`<?xml version="1.0" encoding="UTF-8"?>
        <svg width="${size}" height="${size}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M 12,2 C 8.13,2 5,5.13 5,9 c 0,5.25 7,13 7,13 0,0 7,-7.75 7,-13 0,-3.87 -3.13,-7 -7,-7 z" style="fill:${color};fill-opacity:1" />
          <path d="M 12,14 C 9.24,14 7,11.76 7,9 7,6.24 9.24,4 12,4 c 2.76,0 5,2.24 5,5 0,2.76 -2.24,5 -5,5 z" style="fill:#ffffff;stroke-width:2" />
          ${letter ? `<text style="font-size:8px;line-height:1.25;font-family:sans-serif;fill:${color};text-anchor:middle" x="12" y="11.8">${letter}</text>` : ''}
        </svg>`);
}