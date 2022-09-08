import {InitValidator} from "./validators/InitValidator";
import {CountersValidator} from "./validators/CountersValidator";
import {MaxValidator} from "./validators/MaxValidator";
import {BalanceValidator} from "./validators/BalanceValidator";
import {AxiosResponse} from "axios";

export interface SimpleFeature {
    id: string,
    list: [
        {
            name: string,
            amount: number
        }
    ]
}

export interface ValidatorOutcome {
    isValid: boolean,
    error?: {
        code: string,
        description: string
    }
}

export interface Validator<F> {
    getFeatures(iban: string): Promise<AxiosResponse<F>>

    validate(amount: number, features: F): ValidatorOutcome

    updateState(amount: number, iban: string, features: F): void
}

export const composeValidators = (keys: string[]): Validator<any>[] => {
    const validators: Validator<any>[] = [];

    for (const key of keys) {
        switch (key.toLowerCase()) {
            case ValidatorTypes.INIT:
                validators.push(new InitValidator());
                break;
            case ValidatorTypes.COUNTERS:
                validators.push(new CountersValidator());
                break;
            case ValidatorTypes.MAXIMUM:
                validators.push(new MaxValidator());
                break;
            case ValidatorTypes.BALANCE:
                validators.push(new BalanceValidator());
                break;
            default:
                console.log('validator not recognized');
        }
    }

    return validators;

}

enum ValidatorTypes {
    INIT = 'init',
    COUNTERS = 'counters',
    MAXIMUM = 'maximum',
    BALANCE = 'balance'
}


