import React, { useEffect } from 'react';
import styles from './loader.css';
//import { useAppDispatch } from '../../redux/redux-store';

interface ILoader{
  fileRef: React.RefObject<HTMLInputElement>;
  folderRef: React.RefObject<HTMLInputElement>;
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
}

export function Loader({fileRef, folderRef, setFiles}: ILoader) {
  //const dispatch = useAppDispatch();
  useEffect(() => {
    if (folderRef.current !== null) {
      folderRef.current.setAttribute('directory', '');
      folderRef.current.setAttribute('webkitdirectory', '');
    }
  }, [folderRef]);

  function handleOpenFileFolder(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      if (e.target.files.length > 0) {

        const folder = e.target.files;

        const tmp_files = [];
        for (let i = 0; i < folder.length; i++) {
          const filename = folder[i].name;
          const fileSplitter = filename.split('.');
          const fileFormat = fileSplitter[fileSplitter.length - 1]
            ? fileSplitter[fileSplitter.length - 1].toLowerCase()
            : '';

          if (fileFormat === 'dcm' || fileSplitter.length === 1) {
            tmp_files.push(folder[i]);
          }
        }

        //dispatch(setFiles(tmp_files));
        console.log(tmp_files);
        setFiles(tmp_files);
      } else {
        console.log('cancel');
      }
    }
  }

  return (
    <div className={styles.loader}>
      <input
        ref={fileRef}
        onChange={handleOpenFileFolder}
        type="file"
        id="file_directory"
        name="file_directory"
      />
      <input
        ref={folderRef}
        onChange={handleOpenFileFolder}
        type="file"
        id="folder_directory"
        name="folder_directory"
        multiple
      />
    </div>
  );
}
