const { UserInputError } = require('apollo-server');
const { GraphQLScalarType } = require('graphql');
const { contains, isLength } = require('validator');

const formats = require('./formats');

module.exports = class ConstraintStringType extends GraphQLScalarType {
  constructor(fieldName, type, args) {
    super({
      name: `ConstraintString`,
      serialize(value) {
        value = type.serialize(value);

        validate(fieldName, args, value);

        return value;
      },
      parseValue(value) {
        value = type.serialize(value);

        validate(fieldName, args, value);

        return type.parseValue(value);
      },
      parseLiteral(ast) {
        const value = type.parseLiteral(ast);

        validate(fieldName, args, value);

        return value;
      }
    });
  }
};

function validate(fieldName, args, value) {
  if (args.minLength && !isLength(value, { min: args.minLength })) {
    throw new UserInputError(
      `${fieldName} must be at least ${args.minLength} characters in length`
    );
  }
  if (args.maxLength && !isLength(value, { max: args.maxLength })) {
    throw new UserInputError(
      `${fieldName} must be no more than ${args.maxLength} characters in length`
    );
  }

  if (args.startsWith && !value.startsWith(args.startsWith)) {
    throw new UserInputError(`${fieldName} must start with ${args.startsWith}`);
  }

  if (args.endsWith && !value.endsWith(args.endsWith)) {
    throw new UserInputError(`${fieldName} must end with ${args.endsWith}`);
  }

  if (args.contains && !contains(value, args.contains)) {
    throw new UserInputError(`${fieldName} must contain ${args.contains}`);
  }

  if (args.notContains && contains(value, args.notContains)) {
    throw new UserInputError(
      `${fieldName} must not contain ${args.notContains}`
    );
  }

  if (args.pattern && !new RegExp(args.pattern).test(value)) {
    throw new UserInputError(`${fieldName} must match ${args.pattern}`);
  }

  if (args.format) {
    const formatter = formats[args.format];

    if (!formatter) {
      throw new UserInputError(
        `${fieldName} is an invalid format type ${args.format}`
      );
    }

    try {
      formatter(value); // Will throw if invalid
    } catch (e) {
      throw new UserInputError(`${fieldName} is invalid: ${e.message}`);
    }
  }
}
