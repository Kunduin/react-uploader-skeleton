import { withA11y } from "@storybook/addon-a11y";
import { action } from "@storybook/addon-actions";
import { storiesOf, StoryDecorator } from "@storybook/react";
import React from "react";

import { ReactUploaderSkeleton } from "../src";

const CenterDecorator: StoryDecorator = storyFn => (
  <div style={{ margin: "40px auto", maxWidth: 800 }}>{storyFn()}</div>
);

storiesOf("Hello World", module)
  .addDecorator(withA11y)
  .addDecorator(CenterDecorator)
  .add("with text", () => (
    <ReactUploaderSkeleton onClick={action("my-click")} anyText="meme" />
  ));
