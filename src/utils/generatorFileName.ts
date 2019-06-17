import { IUploaderFileData } from "ReactUploaderSkeleton";

export default (
  currentFiles: IUploaderFileData[],
  nextFileName: string
): string => {
  let index = 0;

  const reg = /\.\w+$/;
  const type = reg.exec(nextFileName);
  const tail = String(type ? type[0] : "");
  const nextName = nextFileName.replace(tail, "");

  while (true) {
    if (
      currentFiles.find(file => {
        if (index === 0) {
          return file.name === nextFileName;
        }
        return file.name === `${nextName}-${index}${tail}`;
      })
    ) {
      index += 1;
      continue;
    } else {
      if (index === 0) {
        return nextFileName;
      } else {
        return `${nextName}-${index}${tail}`;
      }
    }
  }
};
