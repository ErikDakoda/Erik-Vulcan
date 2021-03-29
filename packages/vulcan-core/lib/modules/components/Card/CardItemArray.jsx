import { registerComponent } from 'meteor/vulcan:lib';
import React from 'react';

// Array
const CardItemArray = ({ value, Components, ...rest }) => (
  <ol className="contents-array">
    {value.map((item, index) => (
      <li key={index}>
        {
          <Components.CardItemSwitcher
            value={item}
            typeName={typeof item}
            Components={Components}
            {...rest}
          />
        }
      </li>
    ))}
  </ol>
);
registerComponent({ name: 'CardItemArray', component: CardItemArray });
