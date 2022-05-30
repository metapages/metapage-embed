import React from "react";
import { MetaframeStandaloneComponent } from "@metapages/metapage-embed-react";

export const ExampleEmbedMetaframe: React.FC<{
  url: string;
}> = ({ url }) => {
  const onOutputs = (outputs: any) => {
    console.log(`Got outputs!! outputs=${JSON.stringify(outputs)}`);
  };

  return (
    <div>
      <MetaframeStandaloneComponent
        url={url}
        inputs={{ value: "starting text" }}
        onOutputs={onOutputs as any}
      />
    </div>
  );
};
