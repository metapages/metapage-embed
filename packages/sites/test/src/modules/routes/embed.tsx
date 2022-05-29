import React from "react";
import { Grid, GridItem } from "@chakra-ui/react";
import { ExampleEmbed } from "./embed/ExampleEmbed";

export const Route: React.FC = () => {
  return (
    <Grid templateColumns="repeat(2, 1fr)" gap={6}>
      <GridItem w="100%" h="10" bg="blue.500" />
      <ExampleEmbed url="https://metapages.github.io/metaframe-editor/#?options=eyJhdXRvc2VuZCI6ZmFsc2UsImhpZGVtZW51aWZpZnJhbWUiOmZhbHNlLCJtb2RlIjoiamF2YXNjcmlwdCIsInRoZW1lIjoidnMtZGFyayJ9" />

      {/* <ExampleEmbed url="https://metaframe-editor.dev:4433/metaframe-editor/" /> */}


    </Grid>
  );
};
