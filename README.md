# React Uploader Skeleton

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/kunduin/react-uploader-skeleton/blob/master/LICENSE) [![Travis (.com)](https://img.shields.io/travis/com/kunduin/react-uploader-skeleton.svg)](https://travis-ci.com/Kunduin/react-uploader-skeleton) [![npm](https://img.shields.io/npm/v/react-uploader-skeleton.svg)](https://www.npmjs.com/package/react-uploader-skeleton) [![Greenkeeper badge](https://badges.greenkeeper.io/Kunduin/react-uploader-skeleton.svg)](https://greenkeeper.io/)

A simple skeleton for building an awesome uploader component.

## Install

```Bash
# npm
npm install react-uploader-skeleton

# yarn
yarn add react-uploader-skeleton
```

## Basic Example

```tsx
<ReactUploaderSkeleton
  onFinish={e => console.log('onFinished', e)}
  onFileChange={e => console.log('onFileChange', e)}
  request={(fileData, onProgress, onError, onSuccess) => {
    const xhr = new XMLHttpRequest();
    xhr.upload.addEventListener('progress', e => {
      const done = e.loaded;
      const total = e.total;
      const progress = done / total;
      if (progress > 1) {
        onProgress(1);
      } else {
        onProgress(done / total);
      }
    });
    xhr.addEventListener('readystatechange', () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          onSuccess(xhr.response);
        } else {
          onError();
        }
      }
    });
    xhr.open('POST', 'http://127.0.0.1:3000/file');
    const formData = new FormData();
    formData.append('file', fileData.fileData as File);
    xhr.send(formData);
  }}
/>
```

## Props

### parallelUploads `not required`

**TYPE**

```ts
number;
```

**COMMENT**

How many file uploads to process in parallel.

### onFileChange `required`

**TYPE**

```ts
(files: IUploaderFileData[]) => void
```

see [IUploaderFileData](#iuploaderfiledata)

**COMMENT**

Called when files change.

### onFinish `not required`

**TYPE**

```ts
(files: IUploaderFileData[]) => void
```

see [IUploaderFileData](#iuploaderfiledata)

**COMMENT**

Called when the upload is complete.

### request `required`

```ts
request: (
  uploaderFileData: IUploaderFileData,
  onProgress: (percent: number) => void,
  onError: (message?: string) => void,
  onSuccess: (url?: string) => void
) => void;
```

see [IUploaderFileData](#iuploaderfiledata)

**COMMENT**

Custom upload request.

## children `not required`

**TYPE**

```ts
React.ReactNode;
```

**COMMENT**

Placeholders when there is no file upload.

## Type

### IUploaderFileData

```ts
interface IUploaderFileData {
  name: string; //  name of file
  state: string; //  file state ["resolved","error","waiting","uploading"]
  url?: string; // link to file in cloud
  fileData?: File; // raw file data
  progress?: number; // progress of upload
}
```

## Licence

[MIT License](https://github.com/kunduin/react-uploader-skeleton/blob/master/LICENSE)
