declare module 'react-helmet' {
  import * as React from 'react';

  export interface HelmetProps {
    base?: object;
    bodyAttributes?: object;
    children?: React.ReactNode;
    defaultTitle?: string;
    defer?: boolean;
    encodeSpecialCharacters?: boolean;
    htmlAttributes?: object;
    link?: Array<object>;
    meta?: Array<object>;
    noscript?: Array<object>;
    onChangeClientState?: (newState: object) => void;
    script?: Array<object>;
    style?: Array<object>;
    title?: string;
    titleAttributes?: object;
    titleTemplate?: string;
  }

  export class Helmet extends React.Component<HelmetProps> {}
}
