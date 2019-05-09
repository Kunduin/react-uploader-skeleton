import { storiesOf } from "@storybook/react";
import React from "react";

import ReactUploaderSkeleton from "../src";

storiesOf("Hello World", module).add("with text", () => (
  <ReactUploaderSkeleton anyText="meme" />
));
