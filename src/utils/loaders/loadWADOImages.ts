import { IImage } from "../../pages/MainPage";
import { dicomDatasetToCornerstone, generateDicomData, generateImageId, loadFile } from "./dicomFileReader";

export async function loadWADOImages(files: File[], setImages: React.Dispatch<React.SetStateAction<IImage[]>>) {
    const dicomImages: any[] = [];

    for (let file of files) {
      const imageId = generateImageId(file);
      const image = await loadFile(imageId);
      const dataset = generateDicomData(image);
      //console.log('generateDicomData, dataset', dataset);
      const dicomInfo = dicomDatasetToCornerstone(imageId, dataset);
      //console.log('dicomDatasetToCornerstone, dicomInfo', dataset);
      dicomImages.push(dicomInfo);
    };

    dicomImages.sort((l, r) => {
      return l.instanceNumber - r.instanceNumber;
    });

    const sortByPatientIDSeriesID = [] as {
      id: number;
      patient_id: string;
      series_id: string;
      isImage: boolean;
      data: any[];
    }[];

    dicomImages.map((dcm) => {
      if (dcm.meta.PixelData === undefined) {
        const imageData = {
          id: sortByPatientIDSeriesID.length,
          patient_id: dcm.meta.PatientID,
          series_id: dcm.meta.SeriesInstanceUID,
          isImage: false,
          data: [dcm],
        };
        sortByPatientIDSeriesID.push(imageData);
      } else {
        if (
          sortByPatientIDSeriesID.some(
            (x) =>
              x.patient_id === dcm.meta.PatientID &&
              x.series_id === dcm.meta.SeriesInstanceUID
          )
        ) {
          sortByPatientIDSeriesID
            .find(
              (sorted) =>
                sorted.patient_id === dcm.meta.PatientID &&
                sorted.series_id === dcm.meta.SeriesInstanceUID
            )
            ?.data.push(dcm);
        } else {
          const imageData = {
            id: sortByPatientIDSeriesID.length,
            patient_id: dcm.meta.PatientID,
            series_id: dcm.meta.SeriesInstanceUID,
            isImage: true,
            data: [dcm],
          };
          sortByPatientIDSeriesID.push(imageData);
        }
      }
    });

    setImages(sortByPatientIDSeriesID);
    console.log(dicomImages);
    console.log(sortByPatientIDSeriesID);
    return sortByPatientIDSeriesID;
  }