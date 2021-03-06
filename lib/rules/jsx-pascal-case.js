/**
 * @fileoverview Enforce PascalCase for user-defined JSX components
 * @author Jake Marsh
 */

'use strict';

const elementType = require('jsx-ast-utils/elementType');

// ------------------------------------------------------------------------------
// Constants
// ------------------------------------------------------------------------------

const PASCAL_CASE_REGEX = /^([A-Z0-9]|[A-Z0-9]+[a-z0-9]+(?:[A-Z0-9]+[a-z0-9]*)*)$/;
const COMPAT_TAG_REGEX = /^[a-z]|\-/;
const ALL_CAPS_TAG_REGEX = /^[A-Z0-9]+$/;

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Enforce PascalCase for user-defined JSX components',
      category: 'Stylistic Issues',
      recommended: false
    },

    schema: [{
      type: 'object',
      properties: {
        allowAllCaps: {
          type: 'boolean'
        },
        ignore: {
          type: 'array'
        }
      },
      additionalProperties: false
    }]
  },

  create: function(context) {
    const configuration = context.options[0] || {};
    const allowAllCaps = configuration.allowAllCaps || false;
    const ignore = configuration.ignore || [];

    return {
      JSXOpeningElement: function(node) {
        if (node.isFragment) {
          return;
        }

        let name = elementType(node);

        // Get namespace if the type is JSXNamespacedName or JSXMemberExpression
        if (name.indexOf(':') > -1) {
          name = name.substring(0, name.indexOf(':'));
        } else if (name.indexOf('.') > -1) {
          name = name.substring(0, name.indexOf('.'));
        }

        const isPascalCase = PASCAL_CASE_REGEX.test(name);
        const isCompatTag = COMPAT_TAG_REGEX.test(name);
        const isAllowedAllCaps = allowAllCaps && ALL_CAPS_TAG_REGEX.test(name);
        const isIgnored = ignore.indexOf(name) !== -1;

        if (!isPascalCase && !isCompatTag && !isAllowedAllCaps && !isIgnored) {
          context.report({
            node: node,
            message: `Imported JSX component ${name} must be in PascalCase`
          });
        }
      }
    };
  }
};
