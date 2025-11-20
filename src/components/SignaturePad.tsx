import React, { useRef, useCallback } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { Button } from './ui/button';
import { Trash2, RotateCcw } from 'lucide-react';

interface SignaturePadProps {
  onSignatureChange: (signatureData: string | null) => void;
  width?: number;
  height?: number;
  className?: string;
}

const SignaturePad: React.FC<SignaturePadProps> = ({
  onSignatureChange,
  width = 400,
  height = 200,
  className = ''
}) => {
  const signatureRef = useRef<SignatureCanvas>(null);

  const clearSignature = useCallback(() => {
    if (signatureRef.current) {
      signatureRef.current.clear();
      onSignatureChange(null);
    }
  }, [onSignatureChange]);

  const rotateCanvas = useCallback(() => {
    if (signatureRef.current) {
      const canvas = signatureRef.current.getCanvas();
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((90 * Math.PI) / 180);
        ctx.translate(-canvas.height / 2, -canvas.width / 2);
      }
    }
  }, []);

  const handleEnd = useCallback(() => {
    if (signatureRef.current && !signatureRef.current.isEmpty()) {
      const signatureData = signatureRef.current.toDataURL('image/png');
      onSignatureChange(signatureData);
    } else {
      onSignatureChange(null);
    }
  }, [onSignatureChange]);

  return (
    <div className={`border-2 border-dashed border-gray-300 rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-700">Draw Your Signature</h3>
        <div className="flex gap-2">
          {/* <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={rotateCanvas}
            className="flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Rotate
          </Button> */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={clearSignature}
            className="flex items-center gap-2 text-red-600 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4" />
            Clear
          </Button>
        </div>
      </div>
      
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <SignatureCanvas
          ref={signatureRef}
          canvasProps={{
            width,
            height,
            className: 'w-full h-full border-0',
            style: { border: 'none' }
          }}
          onEnd={handleEnd}
          backgroundColor="white"
          penColor="black"
          minWidth={2}
          maxWidth={3}
        />
      </div>
      
      <p className="text-sm text-gray-500 mt-2 text-center">
        Draw your signature above. Use the button to clear the canvas.
      </p>
    </div>
  );
};

export default SignaturePad;



