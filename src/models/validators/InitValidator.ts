import {SimpleFeature, Validator, ValidatorOutcome} from "../validator";
import axios, {AxiosResponse} from "axios";
import {mocksUrl} from "../../config/dev";

export class InitValidator implements Validator<SimpleFeature> {

    getFeatures(iban: string): Promise<AxiosResponse<SimpleFeature>> {
        return axios.get(mocksUrl + `/features/${iban}`);
    }

    validate(amount: number, features: SimpleFeature): ValidatorOutcome {
        console.log(features);
        const initAmount = features.list.find(value => value.name === 'INIT')?.amount || 0;
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

    updateState(amount: number, iban: string, features: SimpleFeature): void {
        //nothing to update
    }

}
