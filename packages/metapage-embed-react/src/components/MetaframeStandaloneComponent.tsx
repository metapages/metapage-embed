import React, { useEffect, useState } from "react";
import {
  MetaframeInputMap,
  Metapage,
  MetapageEvents,
  MetapageIFrameRpcClient,
} from "@metapages/metapage";
import { MetaframeIframe } from "./MetaframeIframe";

const MetaPageTemplate = {
  version: "0.3",
  metaframes: {
    embed: {
      url: "",
    },
  },
};

export const MetaframeStandaloneComponent: React.FC<{
  url: string;
  inputs?: any;
  onOutputs?: (outputs: MetaframeInputMap) => void;
}> = ({ url, inputs, onOutputs }) => {
  const [metaframe, setMetaframe] = useState<
    MetapageIFrameRpcClient | undefined
  >();

  const [metapage, setMetapage] = useState<Metapage | undefined>();

  // create the metapage and bind
  useEffect(() => {
    // now actually create the metapage, this also instantiates the iframe objects
    const definition = Object.assign({}, { ...MetaPageTemplate });
    definition.metaframes.embed.url = url;

    const metapage = new Metapage();
    // metapage.debug = true;
    metapage.setDefinition(definition);

    setMetapage(metapage);

    const metaframe = metapage.getMetaframe("embed");
    setMetaframe(metaframe);

    if (onOutputs) {
      metaframe.onOutputs(onOutputs);
    }

    return () => {
      metapage.dispose();
    };
  }, [url, setMetaframe, onOutputs]);

  // listeners
  useEffect(() => {
    if (metapage && !metapage.isDisposed() && inputs) {
      metapage.setInputs({
        embed: inputs,
      });
    }
  }, [metapage, inputs]);

  // listeners
  useEffect(() => {
    if (!metapage || metapage.isDisposed() || !onOutputs) {
      return;
    }
    const disposer = metapage.addListenerReturnDisposer(
      MetapageEvents.Outputs,
      onOutputs
    );
    return () => {
      disposer();
    };
  }, [metapage, onOutputs]);

  if (!metaframe) {
    return <p>...</p>;
  }

  return <MetaframeIframe metaframe={metaframe} />;
};
