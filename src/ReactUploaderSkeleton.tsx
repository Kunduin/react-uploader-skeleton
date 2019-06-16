import React, { createRef, RefObject } from "react";
import DefaultEmptyPreview from "./DefaultEmptyPreview";
import DefaultFilePreview from "./DefaultFilePreview";
import * as FileState from "./FileState";
import generatorFileName from "./utils/generatorFileName";

export interface IReactUploaderSkeletonProps {
  anyText?: string;
  onClick?: () => void;
}

export interface IUploaderFileData {
  name: string;
  state: string;
  url?: string;
  fileData?: File;
  progress?: number;
  children?: React.ReactNode;
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
      for (const currentFile of files) {
        this.setState(({ currentFiles }) => ({
          currentFiles: [
            ...currentFiles,
            {
              name: generatorFileName(currentFiles, currentFile.name),
              state: FileState.WAITING,
              fileData: currentFile
            }
          ]
        }));
        // if (currentFile && /image\/.+/.test(currentFile.type)) {
        //   const fileReader = new FileReader();
        //   fileReader.addEventListener("load", () => {
        //     this.setState(({ currentFiles }) => ({
        //       currentFiles: [
        //         ...currentFiles,
        //         {
        //           url: fileReader.result as string,
        //           name: generatorFileName(currentFiles, currentFile.name),
        //           state: FileState.WAITING,
        //           fileData: currentFile
        //         }
        //       ]
        //     }));
        //   });
        //   fileReader.readAsDataURL(currentFile);
        // }
      }
    }
  };

  public render() {
    const { currentFiles } = this.state;
    const { children } = this.props;
    let sumPercent = 0;
    for (const eachFile of currentFiles) {
      sumPercent += eachFile.progress || 0;
    }
    sumPercent /= currentFiles.length;

    const isEmpty = currentFiles.length === 0;
    return (
      <div className="rus" onClick={this.onUploaderClick}>
        {isEmpty ? (
          children || <DefaultEmptyPreview />
        ) : (
          <>
            <div className="rus-preview-sum">
              <div
                className="rus-preview-sum_progress"
                style={{ transform: `scaleX(${sumPercent || 0.2})` }}
              />
              <div className="rus-preview-info">
                <div>Uploading {currentFiles.length} files</div>
                <div>{sumPercent * 100 || 10}%</div>
              </div>
            </div>
            <div className="rus-preview-container">
              {currentFiles.map(eachFile => (
                <DefaultFilePreview
                  key={eachFile.name}
                  uploaderFileData={eachFile}
                />
              ))}
            </div>
          </>
        )}

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
