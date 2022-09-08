import {Validator, ValidatorOutcome} from "../validator";
import axios, {AxiosResponse} from "axios";
import {mocksUrl} from "../../config/dev";

export interface BalanceFeature {
    id: string,
    balance: number,
}

export class BalanceValidator implements Validator<BalanceFeature> {

    getFeatures(iban: string): Promise<AxiosResponse<BalanceFeature>> {
        return axios.get(mocksUrl + `/balances/${iban}`);
    }

    validate(amount: number, features: BalanceFeature): ValidatorOutcome {
        let isVal = true;
        let error = {code: 'VB_01', description: ''};
        const balance = features.balance;

        if (amount > balance) {
            isVal = false;
            error.description = 'balance not sufficient ' + amount.toFixed(2) +
                ' > ' + balance.toFixed(2);
        }

        if (!error.description)
            return {isValid: isVal};

        return {
            isValid: isVal,
            error
        };
    }

    updateState(amount: number, iban: string, features: BalanceFeature): void {
        const balance = features.balance;
        axios.put<any, any, BalanceFeature>(mocksUrl + '/balances/' + iban, {
                id: iban,
                balance: balance - amount
            }
        ).then(() => console.log('balance updated successfully'))
            .catch(err => console.log('error updating balance state, retrying later', err));
    }

}
