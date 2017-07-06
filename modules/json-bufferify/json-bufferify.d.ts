declare namespace bufferify {
    export function encode(offset: number, data: Object): DataView;
    export function decode(offset: number, obj: any, source: ArrayBuffer): number;
    export function decode(offset: number, obj: any, source: DataView): number;
}