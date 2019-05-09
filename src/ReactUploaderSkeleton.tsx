import React from "react";

interface IReactUploaderSkeletonProps {
  anyText: string;
}

class ReactUploaderSkeleton extends React.Component<
  IReactUploaderSkeletonProps
> {
  public render() {
    return <div>{this.props.anyText}</div>;
  }
}

export default ReactUploaderSkeleton;
