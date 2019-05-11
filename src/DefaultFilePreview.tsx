import React from "react";
import { IUploaderFileData } from "ReactUploaderSkeleton";

interface IDefaultFilePreviewProps {
  uploaderFileData: IUploaderFileData;
}

class DefaultFilePreview extends React.Component<IDefaultFilePreviewProps> {
  public onPreviewClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.stopPropagation();
  };

  public render() {
    const { uploaderFileData } = this.props;
    const { url, fileData, progress = 0 } = uploaderFileData;
    return (
      <div onClick={this.onPreviewClick} className="rus-preview">
        <div className="rus-preview_image-container">
          <div className="rus-preview_progress-bar-container">
            <div
              style={{ transform: `scaleX(${progress})` }}
              className="rus-preview_progress-bar"
            />
          </div>
          <img
            className="rus-preview_image"
            alt={fileData && fileData.name}
            src={url}
          />
        </div>
        <div className="rus-preview_name">{fileData && fileData.name}</div>
      </div>
    );
  }
}

export default DefaultFilePreview;
