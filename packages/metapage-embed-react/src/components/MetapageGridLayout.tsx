import React, {
  ComponentType,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Metapage,
  MetapageDefinition,
  MetapageEventDefinition,
  MetapageEvents,
  MetapageInstanceInputs,
} from "@metapages/metapage";
import GridLayout, { Layout, WidthProvider } from "react-grid-layout";
import hash from "object-hash";
import { MetaframeIframe } from "./MetaframeIframe";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

const ResizingGridLayout = WidthProvider(GridLayout);

export const MetapageGridLayout: React.FC<{
  definition: MetapageDefinition;
  inputs?: MetapageInstanceInputs;
  onOutputs?: (outputs: MetapageInstanceInputs) => void;
  onDefinition?: (e: MetapageDefinition) => void;
  Wrapper: ComponentType<any>;
  ErrorWrapper: ComponentType<any>;
  debug?: boolean;
}> = ({
  definition,
  inputs,
  onOutputs,
  onDefinition,
  debug,
  Wrapper,
  ErrorWrapper,
}) => {
  const definitionRef = useRef<{
    definition: MetapageDefinition;
    hash?: string;
  }>();
  const [definitionInternal, setDefinitionInternal] = useState<
    MetapageDefinition | undefined
  >();
  const [metapage, setMetapage] = useState<Metapage | undefined>();
  const [error, setError] = useState<any | undefined>();

  // Make sure incoming definitions are not duplicates of the current definition
  useEffect(() => {
    if (!definition) {
      definitionRef.current = undefined;
      setDefinitionInternal(undefined);
    } else {
      if (!definitionRef.current) {
        definitionRef.current = { definition };
        setDefinitionInternal(definition);
      } else {
        // lazily compute hashes only once
        if (!definitionRef.current.hash) {
          definitionRef.current.hash = hash(definitionRef.current.definition);
        }
        const hashDefinition = hash(definition);
        if (hashDefinition !== definitionRef.current.hash) {
          definitionRef.current = { definition, hash: hashDefinition };
          setDefinitionInternal(definition);
        }
      }
    }
  }, [definition, setDefinitionInternal, definitionRef]);

  // create the metapage and bind
  useEffect(() => {
    setError(undefined);
    if (!definitionInternal) {
      return;
    }

    // now actually create the metapage
    const metapage = new Metapage();
    metapage.debug = debug!!;
    try {
      metapage.setDefinition(definitionInternal);
    } catch (err) {
      console.error(err);
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
    if (onDefinition) {
      disposers.push(
        metapage.addListenerReturnDisposer(
          MetapageEvents.Definition,
          (e: MetapageEventDefinition) => {
            // Update the local definitionRef that is authoritative on what
            // is actually running, so incoming updates don't unnecessarily
            // clobber (and cause ugly re-renders)
            // This update comes from internal metaframe URL updates, so there's
            // no need to trigger a re-render
            definitionRef.current = { definition: e.definition };
            onDefinition(e.definition);
          }
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
  }, [
    definitionInternal,
    setMetapage,
    onOutputs,
    debug,
    onDefinition,
    definitionRef,
  ]);

  // listeners
  useEffect(() => {
    if (metapage && !metapage.isDisposed() && inputs) {
      metapage.setInputs(inputs);
    }
  }, [metapage, inputs]);

  const defaultLayout = !metapage
    ? []
    : Object.keys(metapage.getMetaframes()).map((metaframeId, i) => {
        return {
          i: metaframeId,
          x: i % 2 === 0 ? 0 : 6,
          y: Math.floor(i / 2),
          w: 6,
          h: 2,
        };
      });
  const rowHeight =
    (metapage &&
      definitionInternal?.meta?.layouts?.["react-grid-layout"]?.props
        ?.rowHeight) ||
    100;
  const containerPadding = (metapage &&
    definitionInternal?.meta?.layouts?.["react-grid-layout"]?.props
      ?.containerPadding) || [5, 5];
  const cols =
    (metapage &&
      definitionInternal?.meta?.layouts?.["react-grid-layout"]?.props?.cols) ||
    12;
  const margin = (metapage &&
    definitionInternal?.meta?.layouts?.["react-grid-layout"]?.props
      ?.margin) || [10, 20];
  let layout =
    metapage && definitionInternal?.meta?.layouts?.["react-grid-layout"]?.layout
      ? [...definitionInternal?.meta?.layouts?.["react-grid-layout"]?.layout]
      : defaultLayout;
  const onLayoutChange = useCallback(
    (layout: Layout[]) => {
      if (!onDefinition || !definitionInternal) {
        return;
      }

      // The passed in definition could be immutable, so we need to clone it
      const newDefinition: MetapageDefinition = JSON.parse(
        JSON.stringify(definitionInternal)
      );
      newDefinition.meta = newDefinition.meta || {};
      newDefinition.meta.layouts = newDefinition.meta.layouts || {};

      const reactGridLayout = {
        docs: "https://www.npmjs.com/package/react-grid-layout",
        props: {
          cols,
          margin,
          rowHeight,
          containerPadding,
        },
        layout,
      };
      newDefinition.meta.layouts["react-grid-layout"] = reactGridLayout;
      onDefinition(newDefinition);
    },
    [onDefinition, definitionInternal]
  );

  if (error) {
    if (ErrorWrapper) {
      return <ErrorWrapper error={error} />;
    } else {
      return <div>Error: {`${error}`}</div>;
    }
  }

  return (
    <ResizingGridLayout
      layout={layout}
      // isBounded={grid.bounded}
      // isDraggable={layoutEditable}
      // isResizable={layoutEditable}
      className="layout"
      cols={cols}
      containerPadding={containerPadding}
      // rowHeight={grid.rowHeight}
      rowHeight={rowHeight}
      margin={margin}
      onLayoutChange={onLayoutChange}
      // onResizeStop={resizeStop}
      // onDragStop={onDragStop}
      // draggableHandle=".widget-drag-handle"
    >
      {!metapage
        ? []
        : Object.keys(metapage.getMetaframes()).map((metaframeId, i) =>
            Wrapper ? (
              <Wrapper key={metaframeId} height={`${rowHeight}px`}>
                <MetaframeIframe
                  key={metaframeId}
                  metaframe={metapage.getMetaframes()[metaframeId]}
                />
              </Wrapper>
            ) : (
              <div key={metaframeId}>
                <MetaframeIframe
                  key={metaframeId}
                  height={`${rowHeight}px`}
                  metaframe={metapage.getMetaframes()[metaframeId]}
                />
              </div>
            )
          )}
    </ResizingGridLayout>
  );
};
