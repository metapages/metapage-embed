import React from "react";
import { Grid, GridItem } from "@chakra-ui/react";
import { ExampleEmbedMetaframe } from "./ExampleEmbedMetaframe";

export const Route: React.FC = () => {
  return (
    <Grid templateColumns="repeat(2, 1fr)" gap={6}>
      <GridItem w="100%" h="10" bg="blue.500" />
      <ExampleEmbedMetaframe url="https://metapages.github.io/metaframe-editor/#?options=eyJhdXRvc2VuZCI6ZmFsc2UsImhpZGVtZW51aWZpZnJhbWUiOmZhbHNlLCJtb2RlIjoiamF2YXNjcmlwdCIsInRoZW1lIjoidnMtZGFyayJ9" />
    </Grid>
  );
};
