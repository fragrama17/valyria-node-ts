import {SimpleFeature, Validator, ValidatorOutcome} from "../validator";
import axios from "axios";
import {mocksUrl} from "../../config/dev";

export class InitValidator implements Validator<SimpleFeature> {

    getFeatures(iban: string, product: string): Promise<SimpleFeature[]> {
        //TODO refactor this log with decorator
        console.log('fetching simpleFeature', product);
        return axios.get(mocksUrl + '/features?name=' + product.toLowerCase());
    }

    validate(amount: number, features: SimpleFeature[]): ValidatorOutcome {
        console.log('logging initValidator feature', features);
        return {
            isValid: amount > features[0].amount
        };
    }

}