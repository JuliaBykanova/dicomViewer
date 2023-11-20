import React, { ChangeEvent, useEffect, useRef, useState }  from 'react';
import styles from './mainpage.css';
import { Header } from '../../components/Header';
import { Loader } from '../../components/Loader';
import { loadWADOImages } from '../../utils/loaders/loadWADOImages';
import { DicomViewport } from '../../components/DicomViewport';
import { ToolsPanel } from '../../components/ToolsPanel';

export interface IImage{
  id: number;
  patient_id: string;
  series_id: string;
  isImage: boolean;
  data: any[];
}

export interface ITool{
  name: string;
  mode: string;
  modeOptions?: {
      mouseButtonMask: number;
  };
}

export function MainPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [images, setImages] = useState<IImage[]>([]);
  const [currentSeries, setCurrentSeries] = useState(0);
  const [tool, setTool] = useState('Pan');

  const fileRef = useRef<HTMLInputElement>(null);
  const folderRef = useRef<HTMLInputElement>(null);

  const [tools] = useState([
    // Mouse
    {
      name: 'Wwwc',
      mode: 'active',
    },
    {
      name: 'Zoom',
      mode: 'active',
      modeOptions: { mouseButtonMask: 2 },
    },
    {
      name: 'Pan',
      mode: 'active',
      modeOptions: { mouseButtonMask: 1 },
    },
    {
      name: 'Magnify',
      mode: 'active',
    },
    {
      name: 'Length', 
      mode: 'active',
    },
    {
      name: 'Angle', 
      mode: 'active',
    },
    {
      name: 'RectangleRoi',
      mode: 'active',
    },
    {
      name: 'Eraser',
      mode: 'active',
    }
    /*// Scroll
    { name: 'StackScrollMouseWheel', mode: 'active' },
    // Touch
    { name: 'PanMultiTouch', mode: 'active' },
    { name: 'ZoomTouchPinch', mode: 'active' },
    { name: 'StackScrollMultiTouch', mode: 'active' },*/
  ]);

  useEffect(() => {
    const sortByPatientIDSeriesID = loadWADOImages(files, setImages);
  }, [files]);

  return (
      <div className={styles.container}>
        <Header title='Работа с изображениями'/>
        <div id='content' className={styles.content}>
          <Loader fileRef={fileRef} folderRef={folderRef} setFiles={setFiles}/>
          {images.find((image) => image.id === currentSeries)?.isImage && 
          <div className={styles.viewportContent}>
            <ToolsPanel tool={tool} setTool={setTool} tools={tools}/>
            <div className={styles.viewport}>
              <DicomViewport images={images} currentSeries={currentSeries} tool={tool} tools={tools}/>
            </div>
          </div>
          }
        </div>
      </div>
    
  );
}
