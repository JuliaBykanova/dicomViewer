declare module "*.css" {
  const styles: { [key: string]: string };
  export = styles;
}

declare module "*.jpeg";

declare module "*.png";

declare module "*.svg" {
  import React = require('react');
  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}

//declare module "dicom-parser";
declare module "cornerstone-wado-image-loader";
declare module "cornerstone-math";
declare module "cornerstone-tools";
declare module "hammerjs";
declare module 'dcmjs';
declare module "react-cornerstone-viewport";

declare global {
  interface Window {
      cornerstoneTools:any;
      cornerstone:any;
      cornerstoneWADOImageLoader: any;
  }
}
