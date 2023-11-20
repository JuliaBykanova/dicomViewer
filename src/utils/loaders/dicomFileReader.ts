import * as cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';
import dcmjs from 'dcmjs';
import { decodeMessage } from './decoder';

export function generateImageId(file: File) {
  return cornerstoneWADOImageLoader.wadouri.fileManager.add(file);
}

export async function loadFile(imageId: string) {
  return cornerstoneWADOImageLoader.wadouri.loadFileRequest(imageId);
}

// Read from OHIF viewer
export function generateDicomData(image: any) {
  let dataset = {};
  try {
    const dicomData = dcmjs.data.DicomMessage.readFile(image);

    dataset = dcmjs.data.DicomMetaDictionary.naturalizeDataset(dicomData.dict);
    dataset = {
      ...dataset,
      _meta: dcmjs.data.DicomMetaDictionary.namifyDataset(dicomData.meta),
    };
  } catch (e) {
    console.error('ERROR READING DICOM FILE', e);
  }

  return dataset;
}

export function dicomDatasetToCornerstone(imageId: string, dataset: any) {
  //console.log('📝', dataset);
  const dicomInfo = {
    imageId: imageId,
    instanceNumber: dataset.InstanceNumber,
    // name: files[i].name,
    // image: image,
    rows: dataset.Rows,
    columns: dataset.Columns,
    sliceDistance: getDicomSliceDistance(dataset),
    sliceLocation: dataset.SliceLocation ? dataset.SliceLocation : 1,
    patient: {
      patientName: decodeMessage(dataset.PatientName),
    },
    study: {
      studyId: dataset.StudyID,
      studyDate: dataset.StudyDate,
      studyTime: dataset.StudyTime,
      studyDateTime:
        dataset.StudyDate === undefined
          ? undefined
          : dicomDateTimeToLocale(`${dataset.StudyDate}.${dataset.StudyTime}`),
      studyDescription: dataset.StudyDescription,
    },
    series: {
      seriesDate: dataset.SeriesDate,
      seriesTime: dataset.SeriesTime,
      seriesDescription: dataset.SeriesDescription,
      seriesInstanceUID: dataset.seriesInstanceUID,
      seriesNumber: dataset.SeriesNumber,
      echoNumber: dataset.EchoNumber,
    },
    meta: dataset,
  };
  //console.log('🐛', dicomInfo);
  return dicomInfo;
}

export function getDicomSliceDistance(dataset: any) {
  try {
    const ipp = dataset.ImagePositionPatient; // Image Position Patient
    //console.log("imagePosition: ", ipp)
    const topLeftCorner = new Array(3).fill(0);
    topLeftCorner[0] = parseFloat(ipp[0]); // X pos of frame (Top left) in real space
    topLeftCorner[1] = parseFloat(ipp[1]); // Y pos of frame (Top left) in real space
    topLeftCorner[2] = parseFloat(ipp[2]); // Z pos of frame (Top left) in real space
    //console.log("topLeftCorner: ", topLeftCorner)

    const iop = dataset.ImageOrientationPatient; // Image Orientation Patient
    //console.log("values: ", iop)
    const v = new Array(3).fill(0).map(() => new Array(3).fill(0));

    v[0][0] = parseFloat(iop[0]); // the x direction cosines of the first row X
    v[0][1] = parseFloat(iop[1]); // the y direction cosines of the first row X
    v[0][2] = parseFloat(iop[2]); // the z direction cosines of the first row X
    v[1][0] = parseFloat(iop[3]); // the x direction cosines of the first column Y
    v[1][1] = parseFloat(iop[4]); // the y direction cosines of the first column Y
    v[1][2] = parseFloat(iop[5]); // the z direction cosines of the first column Y

    // calculate the slice normal from IOP
    v[2][0] = v[0][1] * v[1][2] - v[0][2] * v[1][1];
    v[2][1] = v[0][2] * v[1][0] - v[0][0] * v[1][2];
    v[2][2] = v[0][0] * v[1][1] - v[0][1] * v[1][0];

    //console.log("slice normal from IOP: ", v[2])

    let dist = 0;
    for (let i = 0; i < 3; ++i) dist += v[2][i] * topLeftCorner[i];

    return dist;
  } catch (error) {
    return 1;
  }
}

export function dicomDateTimeToLocale(dateTime: any) {
  const date = new Date(
    dateTime.substring(0, 4) +
      '-' +
      dateTime.substring(4, 6) +
      '-' +
      dateTime.substring(6, 8)
  );
  const time =
    dateTime.substring(9, 11) +
    ':' +
    dateTime.substring(11, 13) +
    ':' +
    dateTime.substring(13, 15);
  const localeDate = date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  return `${localeDate} - ${time}`;
}
