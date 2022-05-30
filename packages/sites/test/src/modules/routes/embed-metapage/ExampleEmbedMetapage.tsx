import React from "react";
import { MetapageGridLayout } from "@metapages/metapage-embed-react";
import { MetapageDefinition, VersionsMetapage } from "@metapages/metapage";
import { Box, propNames } from "@chakra-ui/react";

export const CustomBox: React.FC = (props:any) => {
  return <Box key={props.key} borderWidth='1px' >{props.children}</Box>
}


export const ExampleEmbedMetapage: React.FC = () => {
  const onOutputs = (outputs: any) => {
    console.log(`Got outputs!! outputs=${JSON.stringify(outputs)}`);
  };
  return (
    <div>
      <MetapageGridLayout
        definition={exampleDefinition}
        onOutputs={onOutputs as any}
      />
    </div>
  );
};

const exampleDefinition: MetapageDefinition = {
  version: VersionsMetapage.V0_3,
  meta: {
    layouts: {
      flexboxgrid: {
        docs: "http://flexboxgrid.com/",
        layout: [
          [
            {
              name: "random-data-generator",
              width: "col-xs-4",
              style: {
                maxHeight: "600px",
              },
            },
            {
              url: "https://metapages.org/metaframes/passthrough-arrow/?rotation=90",
              width: "col-xs-1",
            },
            {
              name: "graph-dynamic",
              width: "col-xs-7",
            },
          ],
        ],
      },
    },
  },
  metaframes: {
    "random-data-generator": {
      url: "https://metapages.org/metaframes/random-data-generator/?frequency=1000",
    },
    "graph-dynamic": {
      url: "https://metapages.org/metaframes/graph-dynamic/",
      inputs: [
        {
          metaframe: "random-data-generator",
          source: "y",
          target: "y",
        },
      ],
    },
    "editor": {
      url: "https://metapages.github.io/metaframe-editor/",
      inputs: [
        {
          metaframe: "random-data-generator",
          source: "y",
          target: "value",
        },
      ],
    },
  },
  plugins: [
    "https://metapages.org/metaframes/mermaid.js/?TITLE=0",
    "https://metapages.github.io/metaframe-editor/",
  ],
};
