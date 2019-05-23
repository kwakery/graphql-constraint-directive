const { GraphQLScalarType } = require('graphql');
const { UserInputError } = require('apollo-server');

module.exports = class ConstraintNumberType extends GraphQLScalarType {
  constructor(fieldName, type, args) {
    super({
      name: `ConstraintNumber`,
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
  if (args.min && value < args.min) {
    throw new UserInputError(`${fieldName} must be at least ${args.min}`);
  }

  if (args.max && value > args.max) {
    throw new UserInputError(
      `${fieldName} must be no greater than ${args.max}`
    );
  }

  if (args.exclusiveMin && value <= args.exclusiveMin) {
    throw new UserInputError(
      `${fieldName} must be greater than ${args.exclusiveMin}`
    );
  }
  if (args.exclusiveMax && value >= args.exclusiveMax) {
    throw new UserInputError(
      `${fieldName} must be no greater than ${args.exclusiveMax}`
    );
  }

  if (args.multipleOf && value % args.multipleOf !== 0) {
    throw new UserInputError(
      `${fieldName} must be a multiple of ${args.multipleOf}`
    );
  }
}
