import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'IsStringOrNumber', async: false })
export class IsStringOrNumber implements ValidatorConstraintInterface {
  validate(value: any) {
    return typeof value === 'string' || typeof value === 'number';
  }

  defaultMessage() {
    return 'Value must be a string or a number';
  }
}
