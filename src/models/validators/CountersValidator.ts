import axios from 'axios';
import {Validator, ValidatorOutcome} from "../validator";
import {mocksUrl} from "../../config/dev";

export interface CountersFeature {
    iban: string,
    features: [
        {
            name: string,
            counter: number,
            reportable: boolean
        }
    ]
}

export class CountersValidator implements Validator<CountersFeature> {

    getFeatures(iban: string, product: string): Promise<CountersFeature[]> {
        return axios.get(mocksUrl + '/counters?iban=' + iban + '&' + 'name=...');
    }

    validate(amount: number, features: CountersFeature[]): ValidatorOutcome {

        return {
            error: {
                code: 'VC_01',
                description: 'pinguini tattici nucleari'
            },
            isValid: amount > 1000
        };
    }

}