import React, { createRef, RefObject } from "react";
import DefaultEmptyPreview from "./DefaultEmptyPreview";
import DefaultFilePreview from "./DefaultFilePreview";
import * as FileState from "./FileState";
import generatorFileName from "./utils/generatorFileName";

export interface IReactUploaderSkeletonProps {
  parallelUploads: number;
  request: (
    uploaderFileData: IUploaderFileData,
    onProgress: (percent: number) => void,
    onError: (message?: string) => void,
    onSuccess: (url?: string) => void
  ) => void;
  children?: React.ReactNode;
}

export interface IUploaderFileData {
  name: string;
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
  public static defaultProps = {
    parallelUploads: 5
  };

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

  public onUploaderDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    const { dataTransfer } = event.nativeEvent;
    if (dataTransfer) {
      this.onFileChange(dataTransfer.files);
    }
  };

  public onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    this.onFileChange(files);
  };

  public onFileChange = (files: FileList | null) => {
    if (files) {
      const changeFiles = [];
      const { currentFiles } = this.state;
      for (const currentFile of files) {
        changeFiles.push({
          name: generatorFileName(currentFiles, currentFile.name),
          state: FileState.WAITING,
          fileData: currentFile
        });
      }
      const nextCurrentFiles = [...currentFiles, ...changeFiles];

      this.setState({ currentFiles: nextCurrentFiles });
      this.arrangeFileUpload();
    }
  };

  public render() {
    const { currentFiles } = this.state;
    const { children } = this.props;
    let sumPercent = 0;
    for (const eachFile of currentFiles) {
      sumPercent += eachFile.progress || 0;
    }
    sumPercent = currentFiles.length / sumPercent;
    if (sumPercent > 1) {
      sumPercent = 1;
    }

    const isEmpty = currentFiles.length === 0;
    return (
      <div
        className="rus"
        onClick={this.onUploaderClick}
        onDrop={this.onUploaderDrop}
        onDragOver={e => e.preventDefault()}
        // onDrop={this.onUploaderDrop}
      >
        {isEmpty ? (
          children || <DefaultEmptyPreview />
        ) : (
          <>
            <div className="rus-preview-sum">
              <div
                className="rus-preview-sum_progress"
                style={{ transform: `scaleX(${sumPercent})` }}
              />
              <div className="rus-preview-info">
                <div>Uploading {currentFiles.length} files</div>
                <div>{Math.floor(sumPercent * 100)}%</div>
              </div>
            </div>
            <div className="rus-preview-container">
              {currentFiles.map(eachFile => (
                <DefaultFilePreview
                  key={eachFile.name}
                  uploaderFileData={eachFile}
                  onRemove={() => {
                    this.setState(preState => {
                      const nextFiles = [...preState.currentFiles];
                      const targetIndex = nextFiles.findIndex(
                        value => value.name === eachFile.name
                      );
                      nextFiles.splice(targetIndex, 1);
                      return { currentFiles: nextFiles };
                    });
                  }}
                />
              ))}
            </div>
          </>
        )}

        <input
          className="rus-input"
          ref={this.fileInputRef}
          onChange={this.onInputChange}
          type="file"
          multiple={true}
        />
      </div>
    );
  }

  private arrangeFileUpload = () => {
    this.setState(({ currentFiles }) => {
      const { parallelUploads, request } = this.props;
      const currentUploadingFiles =
        currentFiles.filter(each => each.state === FileState.UPLOADING) || [];
      const toBeUpload = parallelUploads - currentUploadingFiles.length;

      if (toBeUpload > 0) {
        for (const eachFile of currentFiles) {
          if (toBeUpload > 0 && eachFile.state === FileState.WAITING) {
            const updateThisFile = (
              nextFile: IUploaderFileData,
              hasCallBack?: boolean
            ) => {
              this.setState(
                preState => {
                  const nextFiles = [...preState.currentFiles];
                  const fileIndex = nextFiles.findIndex(
                    eachNextFile => eachNextFile.name === eachFile.name
                  );
                  if (fileIndex >= 0) {
                    nextFiles[fileIndex] = nextFile;
                    return { currentFiles: nextFiles };
                  }
                  return { currentFiles: preState.currentFiles };
                },
                hasCallBack ? this.arrangeFileUpload : () => null
              );
            };

            request(
              eachFile,
              progress => {
                updateThisFile({ ...eachFile, progress });
              },
              () => {
                updateThisFile({ ...eachFile, state: FileState.ERROR }, true);
              },
              successUrl => {
                updateThisFile(
                  {
                    ...eachFile,
                    state: FileState.RESOLVED,
                    url: successUrl,
                    progress: 1
                  },
                  true
                );
              }
            );

            eachFile.state = FileState.UPLOADING;
          }
        }
      }
      return { currentFiles: [...currentFiles] };
    });
  };
}

export default ReactUploaderSkeleton;
