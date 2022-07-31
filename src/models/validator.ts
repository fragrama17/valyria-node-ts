import {InitValidator} from "./validators/InitValidator";
import {CountersValidator} from "./validators/CountersValidator";
import {MaxValidator} from "./validators/MaxValidator";
import {BalanceValidator} from "./validators/BalanceValidator";
import {ChangeStreamInvalidateDocument} from "mongodb";

export interface ValidatorOutcome {
    isValid: boolean,
    error?: {
        code: string,
        description: string
    }
}

export enum ValidatorTypes {
    INIT = 'init',
    COUNTERS = 'counters',
    MAXIMUM = 'maximum',
    BALANCE = 'balance'
}

export interface SimpleFeature {
    name: string,
    amount: number
}

export interface Validator<F> {
    getFeatures(iban: string, product: string): Promise<F[]>
    validate(amount: number, features: F[]): ValidatorOutcome
}

export const composeValidators = (keys: string[]): Validator<any>[] => {
    const validators: Validator<any>[] = [];

    for (const key of keys) {
        switch (key.toLowerCase()) {
            case ValidatorTypes.INIT:
                validators.push(validatorsMap.init);
                break;
            case ValidatorTypes.COUNTERS:
                validators.push(validatorsMap.counters);
                break;
            case ValidatorTypes.MAXIMUM:
                validators.push(validatorsMap.maximum);
                break;
            case ValidatorTypes.BALANCE:
                validators.push(validatorsMap.balance);
                break;
            default:
                console.log('validator not recognized')
        }
    }

    return validators;

}

const validatorsMap = {
    init: new InitValidator(),
    counters: new CountersValidator(),
    maximum: new MaxValidator(),
    balance: new BalanceValidator()
}


