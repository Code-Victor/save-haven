declare module "*.svg" {
  import React from "react";
  import { SvgProps } from "react-native-svg";
  const content: React.FC<SvgProps> & { ref?: React.Ref<SVGElement> };
  export default content;
}
