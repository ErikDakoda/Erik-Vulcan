import React from 'react';
import { registerComponent } from 'meteor/vulcan:lib';

const AppComponents = () => <div className="app-components"/>;

AppComponents.displayName = 'AppComponents';

registerComponent('AppComponents', AppComponents);

