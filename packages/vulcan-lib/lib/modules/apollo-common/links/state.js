/**
 * Setup apollo-link-state
 * Apollo-link-state helps to manage a local store for caching and client-side
 * data storing
 * It replaces previous implementation using redux
 * Link state doc:
 * @see https://www.apollographql.com/docs/react/essentials/local-state.html
 * @see https://www.apollographql.com/docs/link/links/state.html
 * General presentation on Links
 * @see https://www.apollographql.com/docs/link/
 * Example
 * @see https://hackernoon.com/storing-local-state-in-react-with-apollo-link-state-738f6ca45569
 */
import { withClientState } from 'apollo-link-state';
import GraphQLJSON from 'graphql-type-json';
import GraphQLDate from 'graphql-date';


/**
 * Create a state link
 */
export const createStateLink = ({ cache, resolvers, defaults, ...otherOptions }) => {
  const stateLink = withClientState({
    cache,
    defaults: defaults || getStateLinkDefaults(),
    resolvers: resolvers || getStateLinkResolvers(),
    ...otherOptions,
  });
  return stateLink;
};

// Client-side local state schema
// https://www.apollographql.com/docs/react/data/local-state/#client-side-schema
const registeredSchemas = [];
export const addLocalStateSchema = (schema) => {
  registeredSchemas.push(schema);
};
export const getLocalStateSchemas = () => registeredSchemas.join('\n');

// Defaults initialize the local state cache
// https://www.apollographql.com/docs/react/data/local-state/#initializing-the-cache
const registeredDefaults = {};
export const registerStateLinkDefault = ({ name, defaultValue, options = {} }) => {
  registeredDefaults[name] = defaultValue;
  return registeredDefaults;
};
export const getStateLinkDefaults = () => registeredDefaults;
export const getStateLinkDefault = (varName) => registeredDefaults[varName];


// Mutation are equivalent to a Redux Action + Reducer
// except it uses GraphQL to retrieve/update data in the cache
// https://www.apollographql.com/docs/react/data/local-state/#managing-the-cache
const registeredMutations = {};
export const registerStateLinkMutation = ({ name, mutation, options = {} }) => {
  registeredMutations[name] = mutation;
  return registeredMutations;
};
export const getStateLinkMutations = () => registeredMutations;

export const getStateLinkResolvers = () => ({
  JSON: GraphQLJSON,
  Date: GraphQLDate,
  Mutation: getStateLinkMutations(),
});
