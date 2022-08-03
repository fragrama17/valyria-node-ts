import {Validator, ValidatorOutcome} from "../validator";
import axios, {AxiosResponse} from "axios";
import {mocksUrl} from "../../config/dev";

export interface BalanceFeature {
    id: number,
    balance: number,
    iban: string
}

export class BalanceValidator implements Validator<BalanceFeature> {

    getFeatures(iban: string, productFeature: string): Promise<AxiosResponse<BalanceFeature[]>> {
        return axios.get(mocksUrl + '/balances?iban=' + iban);
    }

    validate(amount: number, features: BalanceFeature[]): ValidatorOutcome {
        let isVal = true;
        let error = {code: 'VB_01', description: ''};
        const balance = features[0].balance;

        if (amount > balance) {
            isVal = false;
            error.description = 'balance not sufficient ' + amount.toFixed(2) + ' > ' + balance.toFixed(2);
        }

        if (!error.description)
            return {isValid: isVal};

        return {
            isValid: isVal,
            error
        };
    }

    updateState(amount: number, iban: string, features: BalanceFeature[]): void {
        const id = features[0].id;
        const balance = features[0].balance;
        axios.put<any, any, BalanceFeature>(mocksUrl + '/balances/' + id, {
                id: id,
                iban: iban,
                balance: balance - amount
            }
        ).then(() => console.log('balance updated successfully'))
            .catch(err => console.log('error updating balance state, retrying later', err));
    }

}