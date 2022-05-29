import React, { useEffect, useRef } from "react";
import { MetapageIFrameRpcClient } from "@metapages/metapage";

export const MetaframeIframe: React.FC<{
  metaframe: MetapageIFrameRpcClient;
}> = ({ metaframe }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    if (!metaframe) {
      return;
    }
    if (metaframe.isDisposed()) {
      return;
    }
    // metaframe._disposables.push(

    (async () => {
      // the iframe is delivered asynchronously

      // metaframe.on("ready", () => {

      if (metaframe.isDisposed()) {
        return;
      }

      if (cancelled) {
        return;
      }
      const iframe = await metaframe.iframe;
      if (metaframe.isDisposed()) {
        return;
      }
      if (cancelled) {
        return;
      }
      if (!ref?.current) {
        return;
      }

      if (!ref.current.firstChild || ref.current.firstChild !== iframe) {
        const child: ChildNode | null = ref.current.firstChild;
        if (child) {
          ref.current.removeChild(child);
        }
        // https://stackoverflow.com/questions/18765762/how-to-make-width-and-height-of-iframe-same-as-its-parent-div
        iframe.style.cssText =
          "position:absolute;top:0px;width:100%;height:100vh;";
        ref.current.appendChild(iframe);
      }
    })();

    return () => {
      cancelled = true;
      while (ref?.current?.firstChild) {
        ref.current.removeChild(ref.current.firstChild);
      }
    };
  }, [metaframe, ref]);

  if (!metaframe) {
    return <p>Missing metaframe</p>;
  }

  return <div ref={ref} id="wrapper" style={{ position: "relative" }}></div>;
};
