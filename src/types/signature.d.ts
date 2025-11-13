declare module 'react-signature-canvas' {
  import { Component } from 'react';

  interface SignatureCanvasProps {
    canvasProps?: any;
    onEnd?: () => void;
    onBegin?: () => void;
    backgroundColor?: string;
    penColor?: string;
    minWidth?: number;
    maxWidth?: number;
    throttle?: number;
    velocityFilterWeight?: number;
    dotSize?: number;
    ref?: any;
  }

  class SignatureCanvas extends Component<SignatureCanvasProps> {
    clear(): void;
    isEmpty(): boolean;
    toDataURL(type?: string, encoderOptions?: number): string;
    fromDataURL(dataURL: string): void;
    getCanvas(): HTMLCanvasElement;
    getSignaturePad(): any;
  }

  export default SignatureCanvas;
}



