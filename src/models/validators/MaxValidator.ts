import {SimpleFeature, Validator, ValidatorOutcome} from "../validator";
import axios, {AxiosResponse} from "axios";
import {mocksUrl} from "../../config/dev";

export class MaxValidator implements Validator<SimpleFeature> {

    getFeatures(iban: string, product: string): Promise<AxiosResponse<SimpleFeature[]>> {
        return axios.get(mocksUrl + '/products=' + product);
    }

    validate(amount: number, features: SimpleFeature[]): ValidatorOutcome {

        return {
            isValid: features[0].amount >= amount
        }
    }

    updateState(amount: number, iban: string, features: SimpleFeature[]): void {
        // nothing to update
    }

}