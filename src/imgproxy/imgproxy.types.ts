export type ResizingType = 'fit' | 'fill' | 'auto';
export type Gravity =
  | 'no'
  | 'so'
  | 'ea'
  | 'we'
  | 'noea'
  | 'nowe'
  | 'sowa'
  | 'sowe'
  | 'ce'
  | 'cm'
  | `fp:${number}|{number}`;

export type Process = {
  resizingType: ResizingType;
  width: number;
  height: number;
  gravity: Gravity;
  enlarge: boolean;
};
export type Extension = 'png' | 'jpg' | 'webp';

export type ImgproxyOption =
  | {extension: Extension}
  | {process: Process}
  | {extension: Extension; process: Process};
