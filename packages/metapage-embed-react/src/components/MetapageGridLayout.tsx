import React, { ComponentType, useCallback, useEffect, useState } from "react";
import {
  Metapage,
  MetapageDefinition,
  MetapageEvents,
  MetapageInstanceInputs,
} from "@metapages/metapage";
import GridLayout, { ItemCallback, Layout, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { MetaframeIframe } from './MetaframeIframe';

const ResizingGridLayout = WidthProvider(GridLayout);

export const MetapageGridLayout: React.FC<{
  definition: MetapageDefinition;
  inputs?: MetapageInstanceInputs;
  onOutputs?: (outputs: MetapageInstanceInputs) => void;
  onDefinitionChange?: (definition: MetapageDefinition) => void;
  styleProps?: React.CSSProperties;
  stylePropsTitle?: React.CSSProperties;
  showTitle?: boolean;
  Wrapper: ComponentType<any>;
  debug?: boolean;
}> = ({ definition, inputs, onOutputs, onDefinitionChange, debug, styleProps = {width:"100%", height:"100%", overflowY: "scroll"}, stylePropsTitle, showTitle, Wrapper }) => {
  const [metapage, setMetapage] = useState<Metapage | undefined>();
  const [error, setError] = useState<any | undefined>();

  // create the metapage and bind
  useEffect(() => {
    setError(undefined);
    // now actually create the metapage
    const metapage = new Metapage();
    metapage.debug = debug!!;
    try {
      metapage.setDefinition(definition);
    } catch (err) {
      setMetapage(undefined);
      setError(err);
      return;
    }

    setMetapage(metapage);

    const disposers: (() => void)[] = [];
    disposers.push(
      metapage.addListenerReturnDisposer(MetapageEvents.Error, setError)
    );
    if (onOutputs) {
      disposers.push(
        metapage.addListenerReturnDisposer(MetapageEvents.Outputs, onOutputs)
      );
    }
    if (onDefinitionChange) {
      disposers.push(
        metapage.addListenerReturnDisposer(
          MetapageEvents.Definition,
          onDefinitionChange
        )
      );
    }

    return () => {
      while (disposers.length > 0) {
        const disposer = disposers.pop();
        if (disposer) {
          disposer();
        }
      }
      metapage.dispose();
    };
  }, [definition, setMetapage, onOutputs, debug]);

  // listeners
  useEffect(() => {
    if (metapage && !metapage.isDisposed() && inputs) {
      metapage.setInputs(inputs);
    }
  }, [metapage, inputs]);

  const onLayoutChange = useCallback(
    (layout: Layout[]) => {
      console.log('layout', layout);
    },
    []
  );


  // if (!metapage && !error) {
  //   return <Spinner />;
  // }

  // return <MetaframeIframe metaframe={metaframe} />;

  // const layout = [
  //   { i: "a", x: 0, y: 0, w: 1, h: 2, static: true },
  //   { i: "b", x: 1, y: 0, w: 3, h: 2, minW: 2, maxW: 4 },
  //   { i: "c", x: 4, y: 0, w: 1, h: 2 },
  // ];


  const layout = !metapage ? [] : Object.keys(metapage.getMetaframes()).map((metaframeId, i) => {
    return {
      i: metaframeId,
      x: i % 2 === 0 ? 0 : 6,
      y: Math.floor(i / 2),
      w: 6,
      h: 2,
    }
  })


  const rowHeight = 100;

  console.log('layout', layout);

  return (
    <ResizingGridLayout
      layout={layout}
      // isBounded={grid.bounded}
      // isDraggable={layoutEditable}
      // isResizable={layoutEditable}
      className="layout"
      // cols={grid.cols}
      cols={12}
      containerPadding={[5, 5]}
      // rowHeight={grid.rowHeight}
      rowHeight={rowHeight}
      // width={1200}
      margin={[10, 20]}
      onLayoutChange={onLayoutChange}
      // onResizeStop={resizeStop}
      // onDragStop={onDragStop}
      // draggableHandle=".widget-drag-handle"
    >

      {
        !metapage ? [] : Object.keys(metapage.getMetaframes()).map((metaframeId, i) =>
          <Wrapper key={metaframeId} height={`${2*rowHeight}px`} ><MetaframeIframe key={metaframeId} metaframe={metapage.getMetaframes()[metaframeId]} /></Wrapper>
        )
      }

{/* height={"500px"} */}
{/* style={styleProps} */}
      {/* {
        !metapage ? [] : Object.keys(metapage.getMetaframes()).map((metaframeId, i) =>
          <div key={metaframeId} ><MetaframeIframe key={metaframeId} height={`${2*rowHeight}px`} metaframe={metapage.getMetaframes()[metaframeId]} /></div>
        )
      } */}
    </ResizingGridLayout>
  );

  // return (
  //   <GridLayout
  //     className="layout"
  //     layout={layout}
  //     cols={12}
  //     rowHeight={100}
  //     width={1200}
  //   >
  //     {
  //       !metapage ? [] : Object.keys(metapage.getMetaframes()).map((metaframeId, i) =>
  //         <div key={metaframeId} style={{width:"100%", height:"100%", overflowY: "scroll" }}><MetaframeIframe key={metaframeId} metaframe={metapage.getMetaframes()[metaframeId]} /></div>
  //       )
  //     }

  //   {/* <div key="random-data-generator" bg="white" w="100%" p={4} color="black">random-data-generator</div> */}
  //      {/* <div key="random-data-generator"><MetaframeIframe metaframe={metapage?.getMetaframes()["random-data-generator"]} /></div> */}
  //     {/* <div key="graph-dynamic"><MetaframeIframe metaframe={metapage?.getMetaframes()["graph-dynamic"]} /></div> */}

  //   </GridLayout>
  // );
};
