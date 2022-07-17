import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { ListItem, UnorderedList, Link } from "@chakra-ui/react";

export const Route: React.FC = () => {
  return (
    <div>
      <UnorderedList>
        <ListItem>
          <Link as={RouterLink} to="/embed-metaframe">
            embed metaframe
          </Link>
        </ListItem>
        <ListItem>
          <Link as={RouterLink} to="/embed-metapage-from-definition">
            embed metapage from definition
          </Link>
        </ListItem>
        <ListItem>
          <Link as={RouterLink} to="/embed-metapage-from-object">
            embed metapage from object
          </Link>
        </ListItem>
      </UnorderedList>
    </div>
  );
};
