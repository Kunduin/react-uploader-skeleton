import { withA11y } from "@storybook/addon-a11y";
import { storiesOf, StoryDecorator } from "@storybook/react";
import React from "react";

import { ReactUploaderSkeleton } from "../src";

const CenterDecorator: StoryDecorator = storyFn => (
  <div style={{ margin: "40px auto", maxWidth: 400 }}>{storyFn()}</div>
);

storiesOf("Hello World", module)
  .addDecorator(withA11y)
  .addDecorator(CenterDecorator)
  .add("with text", () => (
    <ReactUploaderSkeleton
      request={(fileData, onProgress, onError, onSuccess) => {
        const xhr = new XMLHttpRequest();
        xhr.upload.addEventListener("progress", e => {
          const done = e.loaded;
          const total = e.total;
          const progress = done / total;
          if (progress > 1) {
            onProgress(1);
          } else {
            onProgress(done / total);
          }
        });
        xhr.addEventListener("readystatechange", () => {
          if (xhr.readyState === 4) {
            if (xhr.status === 200) {
              onSuccess(xhr.response);
            } else {
              onError();
            }
          }
        });

        xhr.open("POST", "http://127.0.0.1:3000/file");
        const formData = new FormData();
        formData.append("file", fileData.fileData as File);
        xhr.send(formData);
      }}
    />
  ));
