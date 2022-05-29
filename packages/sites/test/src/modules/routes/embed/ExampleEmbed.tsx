import { MetaframeStandaloneComponent } from "@metapages/metapage-embed-react";
import { MetaframeInputMap, MetapageState } from "@metapages/metapage";
import React, { useEffect, useRef } from "react";

export const ExampleEmbed: React.FC<{
  url: string;
}> = ({ url }) => {

  const onOutputs = (outputs: any) => {
    console.log(`Got outputs!! outputs=${JSON.stringify(outputs)}`);
  }


  return (
    <div>
      <MetaframeStandaloneComponent url={url} inputs={{value:"starting text"}} onOutputs={onOutputs as any}/>
    </div>
  );
};
