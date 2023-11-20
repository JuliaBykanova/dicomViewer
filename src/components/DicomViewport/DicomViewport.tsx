import React, { useState } from 'react';
import styles from './dicomviewport.css';
import { IImage, ITool } from '../../pages/MainPage';
import CornerstoneViewport from 'react-cornerstone-viewport';
//import { useAppDispatch } from '../../redux/redux-store';

interface IDicomViewport{
  images: IImage[];
  currentSeries: number;
  tool: string;
  tools: ITool[];
}

export function DicomViewport({images, currentSeries, tool, tools}: IDicomViewport) {
  //const dispatch = useAppDispatch();

  return (
    <CornerstoneViewport
      imageIds={images
        .find(
          (image: {
            id: number;
            patient_id: string;
            series_id: string;
            isImage: boolean;
            data: any[];
          }) => image.id === currentSeries
        )?.data.map((imageData) => imageData.imageId)}
        tools={tools}
        activeTool={tool}
    />
  );
}
