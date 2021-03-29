import React from 'react';
import FormSuggest from '../base-controls/FormSuggest';
import FormInput from '../base-controls/FormInput';
import { registerComponent } from 'meteor/vulcan:core';
import { countryInfo } from './countries';
import _get from 'lodash/get';
import _omit from 'lodash/omit';
import _cloneDeep from 'lodash/cloneDeep';


export const getCountryInfo = function (formComponentProps, shortLabels) {
  const addressPath = formComponentProps.path;
  const countryParts = addressPath.split('.');
  countryParts[countryParts.length-1] = 'country';
  const country = _get(formComponentProps.document, countryParts);
  let currentCountryInfo = country && countryInfo[country];
  if (currentCountryInfo?.regions && shortLabels) {
    currentCountryInfo = _cloneDeep(currentCountryInfo);
    currentCountryInfo.regions.forEach(region => region.label = region.value);
  }
  return currentCountryInfo
};


const RegionSelect = ({ classes, inputProperties = {}, refFunction, ...properties }) => {
  const currentCountryInfo = getCountryInfo(properties, inputProperties.shortLabels);
  const options = currentCountryInfo ? currentCountryInfo.regions : null;
  const regionLabel = currentCountryInfo ? currentCountryInfo.regionLabel : 'Region';
  inputProperties = _omit(inputProperties, 'shortLabels');

  if (options) {
    return <FormSuggest {...properties} inputProperties={inputProperties} ref={refFunction} options={options} label={regionLabel}/>;
  } else {
    return <FormInput {...properties} inputProperties={inputProperties} ref={refFunction} label={regionLabel}/>;
  }
};


registerComponent('RegionSelect', RegionSelect);
