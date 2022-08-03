import {SimpleFeature, Validator, ValidatorOutcome} from "../validator";
import axios, {AxiosResponse} from "axios";
import {mocksUrl} from "../../config/dev";

export class InitValidator implements Validator<SimpleFeature> {

    getFeatures(iban: string, product: string): Promise<AxiosResponse<SimpleFeature[]>> {
        return axios.get<SimpleFeature[]>(mocksUrl + '/features?name=' + product);
    }

    validate(amount: number, features: SimpleFeature[]): ValidatorOutcome {
        const initAmount = features[0].amount;
        let error = {
            code: '',
            description: ''
        }
        const isValid = amount >= initAmount;
        if (!isValid) {
            error.code = 'IN00';
            error.description = 'minimum amount required ' + initAmount.toFixed(2)
                + ', but was ' + amount.toFixed(2);
            return {
                isValid: isValid,
                error
            };
        }

        return {
            isValid: isValid
        };

    }

    updateState(amount: number, iban: string, features: SimpleFeature[]): void {
        //nothing to update
    }

}