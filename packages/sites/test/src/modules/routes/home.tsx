import React from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  ListItem,
  UnorderedList,
  Link,
} from "@chakra-ui/react";

export const Route: React.FC = () => {
  return (
    <div>
      <UnorderedList>
        <ListItem>
          <Link as={RouterLink} to="/embed">
            embed
          </Link>
        </ListItem>
      </UnorderedList>
    </div>
  );
};
