import React, { createRef, RefObject } from "react";
import DefaultFilePreview from "./DefaultFilePreview";
import * as FileState from "./FileState";

export interface IReactUploaderSkeletonProps {
  anyText?: string;
  onClick?: () => void;
}

export interface IUploaderFileData {
  id: number | string;
  state: string;
  url?: string;
  fileData?: File;
  progress?: number;
}

export interface IReactUploaderSkeletonState {
  currentFiles: IUploaderFileData[];
}

class ReactUploaderSkeleton extends React.Component<
  IReactUploaderSkeletonProps,
  IReactUploaderSkeletonState
> {
  public static defaultProps = {};

  public readonly state: IReactUploaderSkeletonState = {
    currentFiles: []
  };

  private fileInputRef: RefObject<HTMLInputElement>;

  constructor(props: IReactUploaderSkeletonProps) {
    super(props);
    this.fileInputRef = createRef<HTMLInputElement>();
  }

  public onUploaderClick = () => {
    const { current } = this.fileInputRef;
    if (current) {
      current.click();
    }
  };

  public onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    if (files) {
      for (const fileIndex in files) {
        const currentFile = files[fileIndex];
        if (currentFile && /image\/.+/.test(currentFile.type)) {
          const fileReader = new FileReader();
          fileReader.addEventListener("load", () => {
            this.setState(({ currentFiles }) => ({
              currentFiles: [
                ...currentFiles,
                {
                  url: fileReader.result as string,
                  id: currentFile.name,
                  state: FileState.WAITING,
                  fileData: currentFile
                }
              ]
            }));
          });
          fileReader.readAsDataURL(files[fileIndex]);
        }
      }
    }
  };

  public render() {
    const { currentFiles } = this.state;
    return (
      <div className="rus" onClick={this.onUploaderClick}>
        <div className="rus-preview-container">
          {currentFiles.map(file => (
            <DefaultFilePreview key={file.id} uploaderFileData={file} />
          ))}
        </div>
        <input
          className="rus-input"
          ref={this.fileInputRef}
          onChange={this.onFileChange}
          type="file"
          multiple={true}
        />
      </div>
    );
  }
}

export default ReactUploaderSkeleton;
