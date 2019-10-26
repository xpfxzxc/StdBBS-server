import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

import { UsersService } from '../../../modules/users/users.service';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsEmailRegisteredConstraint
  implements ValidatorConstraintInterface {
  constructor(private userService: UsersService) {}

  async validate(email: string, args: ValidationArguments) {
    const [registered] = args.constraints;
    return (await this.userService.checkIfEmailExists(email)) === registered;
  }
}

export function IsEmailRegistered(
  isRegistered: boolean,
  validationOptions?: ValidationOptions,
) {
  return function(object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [isRegistered],
      validator: IsEmailRegisteredConstraint,
    });
  };
}
