import React from "react";
import { IUploaderFileData } from "ReactUploaderSkeleton";
import * as FileState from "./FileState";

interface IDefaultFilePreviewProps {
  uploaderFileData: IUploaderFileData;
  onRemove: () => void;
}

const CheckMark = () => (
  <svg
    className="rus-preview_tag"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
  >
    <g>
      <g>
        <rect width="24" height="24" opacity="0" />
        <path d="M9.86 18a1 1 0 0 1-.73-.32l-4.86-5.17a1 1 0 1 1 1.46-1.37l4.12 4.39 8.41-9.2a1 1 0 1 1 1.48 1.34l-9.14 10a1 1 0 0 1-.73.33z" />
      </g>
    </g>
  </svg>
);

const CloseCircle = () => (
  <svg
    width="24"
    height="24"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
  >
    <g>
      <g>
        <rect width="24" height="24" opacity="0" />
        <path
          className="rus-preview_delete-circle"
          d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"
        />
        <path d="M14.71 9.29a1 1 0 0 0-1.42 0L12 10.59l-1.29-1.3a1 1 0 0 0-1.42 1.42l1.3 1.29-1.3 1.29a1 1 0 0 0 0 1.42 1 1 0 0 0 1.42 0l1.29-1.3 1.29 1.3a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42L13.41 12l1.3-1.29a1 1 0 0 0 0-1.42z" />
      </g>
    </g>
  </svg>
);

const Close = () => (
  <svg
    className="rus-preview_tag--error"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
  >
    <g>
      <g>
        <rect
          width="24"
          height="24"
          transform="rotate(180 12 12)"
          opacity="0"
        />
        <path d="M13.41 12l4.3-4.29a1 1 0 1 0-1.42-1.42L12 10.59l-4.29-4.3a1 1 0 0 0-1.42 1.42l4.3 4.29-4.3 4.29a1 1 0 0 0 0 1.42 1 1 0 0 0 1.42 0l4.29-4.3 4.29 4.3a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42z" />
      </g>
    </g>
  </svg>
);

class DefaultFilePreview extends React.Component<IDefaultFilePreviewProps> {
  public onPreviewClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.stopPropagation();
  };

  public render() {
    const { uploaderFileData, onRemove } = this.props;
    const { progress = 0, name, state } = uploaderFileData;

    return (
      <div onClick={this.onPreviewClick} className="rus-preview">
        <div className="rus-preview_left">
          <div className="rus-preview_name">
            <strong style={{ marginRight: 4 }}>
              {Math.floor(progress * 100)}%{" · "}
            </strong>
            {uploaderFileData.url ? (
              <a
                target="_blank"
                href={uploaderFileData.url}
                className="rus-preview_file-name "
              >
                {name}
              </a>
            ) : (
              <span className="rus-preview_file-name ">{name}</span>
            )}

            {uploaderFileData.state === FileState.RESOLVED && <CheckMark />}
            {uploaderFileData.state === FileState.ERROR && <Close />}
          </div>

          {uploaderFileData.state !== FileState.RESOLVED && (
            <div className="rus-preview_progress-bar-container">
              <div
                style={{ transform: `scaleX(${progress})` }}
                className={
                  state === FileState.ERROR
                    ? "rus-preview_progress-bar--error"
                    : "rus-preview_progress-bar"
                }
              />
            </div>
          )}
        </div>
        <div className="rus-preview_delete" onClick={onRemove}>
          <CloseCircle />
        </div>
      </div>
    );
  }
}

export default DefaultFilePreview;
