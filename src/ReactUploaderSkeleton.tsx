import React, { createRef, RefObject } from "react";
import * as FileState from "./FileState";

interface IReactUploaderSkeletonProps {
  anyText?: string;
  onClick?: () => void;
}

interface IUploaderFileData {
  id: number | string;
  state: string;
  url?: string;
  fileData?: File;
}

interface IReactUploaderSkeletonState {
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
      <div onClick={this.onUploaderClick} className="rus">
        {this.props.anyText}

        {currentFiles.map(file => (
          <div key={file.id}>
            {file.fileData && file.fileData.name}

            <img alt={file.fileData && file.fileData.name} src={file.url} />
          </div>
        ))}

        <input
          className="rus_input"
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
