// setup JSDOM server side for testing (necessary for Enzyme to mount)
import 'jsdom-global/register';
import React from 'react';
// TODO: should be loaded from Components instead?
import Form from '../lib/components/Form';
import FormComponent from '../lib/components/FormComponent';
import '../lib/components/FormNestedArray';
import expect from 'expect';
import Enzyme, { mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Components } from 'meteor/vulcan:core';

// setup enzyme
// TODO: write a reusable helper and move this to the tests setup
Enzyme.configure({ adapter: new Adapter() });

// we must import all the other components, so that "registerComponent" is called
import '../lib/modules/components';
// and then load them in the app so that <Component.Whatever /> is defined
import { populateComponentsApp, initializeFragments } from 'meteor/vulcan:lib';
// we need registered fragments to be initialized because populateComponentsApp will run
// hocs, like withUpdate, that rely on fragments
initializeFragments();
// actually fills the Components object
populateComponentsApp();

// fixtures
import SimpleSchema from 'simpl-schema';
const addressGroup = {
  name: 'addresses',
  label: 'Addresses',
  order: 10
};
const permissions = {
  canRead: ['guests'],
  canUpdate: ['quests'],
  canCreate: ['guests']
};
const addressSchema = {
  street: {
    type: String,
    optional: true,
    ...permissions
  }
};
// [{street, city,...}, {street, city, ...}]
const arrayOfObjectSchema = {
  addresses: {
    type: Array,
    group: addressGroup,
    ...permissions
  },
  'addresses.$': {
    type: new SimpleSchema(addressSchema)
  }
};
// example with custom inputs for the children
// ["http://maps/XYZ", "http://maps/foobar"]
const arrayOfUrlSchema = {
  addresses: {
    type: Array,
    group: addressGroup,
    ...permissions
  },
  'addresses.$': {
    type: String,
    input: 'url'
  }
};
// example with a fully custom input for the array
const ArrayInput = () => 'ARRAY INPUT';
const arrayOfUrlCustomSchema = {
  addresses: {
    type: Array,
    group: addressGroup,
    ...permissions,
    input: ArrayInput
  },
  'addresses.$': {
    type: String,
    input: 'url'
  }
};
// example with a native type
// ["20 rue du Moulin PARIS", "16 rue de la poste PARIS"]
const arrayOfStringSchema = {
  addresses: {
    type: Array,
    group: addressGroup,
    ...permissions
  },
  'addresses.$': {
    type: String
  }
};

// object (not in an array): {street, city}
const objectSchema = {
  addresses: {
    type: new SimpleSchema(addressSchema),
    ...permissions
  }
};
// without calling SimpleSchema
const bareObjectSchema = {
  addresses: {
    type: addressSchema,
    ...permissions
  }
};

// stub collection
import { createCollection, getDefaultResolvers, getDefaultMutations } from 'meteor/vulcan:core';
const createDummyCollection = (typeName, schema) =>
  createCollection({
    collectionName: typeName + 's',
    typeName,
    schema,
    resolvers: getDefaultResolvers(typeName + 's'),
    mutations: getDefaultMutations(typeName + 's')
  });
const ArrayOfObjects = createDummyCollection('ArrayofObject', arrayOfObjectSchema);
const Objects = createDummyCollection('Object', objectSchema);
const ArrayOfUrls = createDummyCollection('ArrayOfUrl', arrayOfUrlSchema);

const Addresses = createCollection({
  collectionName: 'Addresses',
  typeName: 'Address',
  schema: addressSchema,
  resolvers: getDefaultResolvers('Addresses'),
  mutations: getDefaultMutations('Addresses')
});

// helpers
// tests
describe('vulcan-forms/components', function() {
  const context = {
    intl: {
      formatMessage: () => '',
      formatDate: () => '',
      formatTime: () => '',
      formatRelative: () => '',
      formatNumber: () => '',
      formatPlural: () => '',
      formatHTMLMessage: () => ''
    }
  };
  // eslint-disable-next-line no-unused-vars
  const mountWithContext = C =>
    mount(C, {
      context
    });
  const shallowWithContext = C =>
    shallow(C, {
      context
    });
  describe('Form (handle fields computation)', function() {
    describe('basic collection - no nesting', function() {
      it('shallow render', function() {
        const wrapper = shallowWithContext(<Form collection={Addresses} />);
        expect(wrapper).toBeDefined();
      });
    });
    describe('array of objects', function() {
      it('shallow render', () => {
        const wrapper = shallowWithContext(<Form collection={ArrayOfObjects} />);
        expect(wrapper).toBeDefined();
      });
      it('render a FormGroup for addresses', function() {
        const wrapper = shallowWithContext(<Form collection={ArrayOfObjects} />);
        const formGroup = wrapper.find('FormGroup').find({ name: 'addresses' });
        expect(formGroup).toBeDefined();
        expect(formGroup).toHaveLength(1);
      });
    });
    describe('nested object (not in array)', function() {
      it('shallow render', () => {
        const wrapper = shallowWithContext(<Form collection={Objects} />);
        expect(wrapper).toBeDefined();
      });
      it('define one field', () => {
        const wrapper = shallowWithContext(<Form collection={Objects} />);
        const defaultGroup = wrapper.find('FormGroup').first();
        const fields = defaultGroup.prop('fields');
        expect(fields).toHaveLength(1); // addresses field
      });

      const getFormFields = wrapper => {
        const defaultGroup = wrapper.find('FormGroup').first();
        const fields = defaultGroup.prop('fields');
        return fields;
      };
      const getFirstField = () => {
        const wrapper = shallowWithContext(<Form collection={Objects} />);
        const fields = getFormFields(wrapper);
        return fields[0];
      };
      it('define the nestedSchema', () => {
        const addressField = getFirstField();
        expect(addressField.nestedSchema.street).toBeDefined();
      });
    });
    describe('array with custom children inputs (e.g array of url)', function() {
      it('shallow render', function() {
        const wrapper = shallowWithContext(<Form collection={ArrayOfUrls} />);
        expect(wrapper).toBeDefined();
      });
      it('should handle array subfield input', () => {
        const wrapper = shallowWithContext(<Form collection={ArrayOfUrls} />);
        const FormGroup = wrapper.find('FormGroup').first();
        //console.log(FormGroup.prop('fields'));
        const fields = FormGroup.prop('fields');
        expect(fields[0].arrayField).toBeDefined();
      });
    });
    describe('array with a custom input', function() {});
  });

  describe('FormComponent (select the components to render and handle state)', function() {
    const shallowWithContext = C =>
      shallow(C, {
        context: {
          getDocument: () => {}
        }
      });
    const defaultProps = {
      disabled: false,
      optional: true,
      document: {},
      name: 'meetingPlace',
      path: 'meetingPlace',
      datatype: [{ type: Object }],
      layout: 'horizontal',
      label: 'Meeting place',
      currentValues: {},
      formType: 'new',
      deletedValues: [],
      throwError: () => {},
      updateCurrentValues: () => {},
      errors: [],
      clearFieldErrors: () => {}
    };
    it('shallow render', function() {
      const wrapper = shallowWithContext(<FormComponent {...defaultProps} />);
      expect(wrapper).toBeDefined();
    });
    describe('array of objects', function() {
      const props = {
        ...defaultProps,
        datatype: [{ type: Array }],
        nestedSchema: {
          street: {},
          country: {},
          zipCode: {}
        },
        nestedInput: true,
        nestedFields: [{}, {}, {}],
        currentValues: {}
      };
      it('render a FormNestedArray', function() {
        const wrapper = shallowWithContext(<FormComponent {...props} />);
        const formNested = wrapper.find('FormNestedArray');
        expect(formNested).toHaveLength(1);
      });
    });
    describe('nested object', function() {
      const props = {
        ...defaultProps,
        datatype: [{ type: new SimpleSchema({}) }],
        nestedSchema: {
          street: {},
          country: {},
          zipCode: {}
        },
        nestedInput: true,
        nestedFields: [{}, {}, {}],
        currentValues: {}
      };
      it('shallow render', function() {
        const wrapper = shallowWithContext(<FormComponent {...props} />);
        expect(wrapper).toBeDefined();
      });
      it('render a FormNestedObject', function() {
        const wrapper = shallowWithContext(<FormComponent {...props} />);
        const formNested = wrapper.find('FormNestedObject');
        expect(formNested).toHaveLength(1);
      });
    });
    describe('array of custom inputs (e.g url)', function() {
      it('shallow render', function() {});
    });
  });

  describe('FormNestedArray - Display the input n times', function() {
    const defaultProps = {
      errors: [],
      deletedValues: [],
      path: 'foobar',
      formComponents: Components
    };
    it('shallow render', function() {
      const wrapper = shallow(<Components.FormNestedArray {...defaultProps} currentValues={{}} />);
      expect(wrapper).toBeDefined();
    });
    it('shows an add button when empty', function() {
      const wrapper = shallow(<Components.FormNestedArray {...defaultProps} currentValues={{}} />);
      const addButton = wrapper.find('IconAdd');
      expect(addButton).toHaveLength(1);
    });
    it('shows 3 items', function() {
      const wrapper = shallow(<Components.FormNestedArray {...defaultProps} currentValues={{}} value={[1, 2, 3]} />);
      const nestedItem = wrapper.find('FormNestedItem');
      expect(nestedItem).toHaveLength(3);
    });
    it('pass the correct path and itemIndex to each form', function() {
      const wrapper = shallow(<Components.FormNestedArray {...defaultProps} currentValues={{}} value={[1, 2]} />);
      const nestedItem = wrapper.find('FormNestedItem');
      const item0 = nestedItem.at(0);
      const item1 = nestedItem.at(1);
      expect(item0.prop('itemIndex')).toEqual(0);
      expect(item1.prop('itemIndex')).toEqual(1);
      expect(item0.prop('path')).toEqual('foobar.0');
      expect(item1.prop('path')).toEqual('foobar.1');
    });
  });
  describe('FormNestedObject', function() {
    const defaultProps = {
      errors: [],
      path: 'foobar',
      formComponents: Components
    };
    it('shallow render', function() {
      const wrapper = shallow(<Components.FormNestedObject {...defaultProps} currentValues={{}} />);
      expect(wrapper).toBeDefined();
    });
    it.skip('render a form for the object', function() {
      // eslint-disable-next-line no-unused-vars
      const wrapper = shallow(<Components.FormNestedObject {...defaultProps} currentValues={{}} />);
      expect(false).toBe(true);
    });
    it('does not show any button', function() {
      const wrapper = shallow(<Components.FormNestedObject {...defaultProps} currentValues={{}} />);
      const button = wrapper.find('BootstrapButton');
      expect(button).toHaveLength(0);
    });
    it('does not show add button', function() {
      const wrapper = shallow(<Components.FormNestedObject {...defaultProps} currentValues={{}} />);
      const addButton = wrapper.find('IconAdd');
      expect(addButton).toHaveLength(0);
    });
    it('does not show remove button', function() {
      const wrapper = shallow(<Components.FormNestedObject {...defaultProps} currentValues={{}} />);
      const removeButton = wrapper.find('IconRemove');
      expect(removeButton).toHaveLength(0);
    });
  });
});
