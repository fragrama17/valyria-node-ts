import {Validator, ValidatorOutcome} from "../validator";
import axios from "axios";
import {mocksUrl} from "../../config/dev";

export interface BalanceFeature {
    balance: number,
    iban: string
}

export class BalanceValidator implements Validator<BalanceFeature> {

    async getFeatures(iban: string, product: string): Promise<BalanceFeature[]> {
        return axios.get(mocksUrl + '/balances/?iban=' + iban);
    }

    validate(amount: number, features: BalanceFeature[]): ValidatorOutcome {
        return {
            isValid: features[0].balance > amount
        };
    }

}