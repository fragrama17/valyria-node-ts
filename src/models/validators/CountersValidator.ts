import axios, {AxiosResponse} from 'axios';
import {Validator, ValidatorOutcome} from "../validator";
import {mocksUrl} from "../../config/dev";

export interface CountersFeature {
    id: string,
    features: [
        {
            name: string,
            counter: number,
            reportable: boolean
        }
    ]
}

export class CountersValidator implements Validator<CountersFeature> {

    getFeatures(iban: string): Promise<AxiosResponse<CountersFeature>> {
        return axios.get(mocksUrl + `/counters/${iban}`);
    }

    validate(amount: number, features: CountersFeature): ValidatorOutcome {
        const counters = features.features;
        let isVal = true;
        let error = {code: 'VC_01', description: ''};

        counters.forEach(c => {
            if (amount > c.counter) {
                isVal = false;
                error.description += 'counter limit ' + c.name + ' reached: ' + amount.toFixed(2) +
                    ' > ' + c.counter.toFixed(2) + ', ';
            }
        });

        if (!error.description)
            return {isValid: isVal};

        return {
            isValid: isVal,
            error
        };
    }

    updateState(amount: number, iban: string, features: CountersFeature): void {
        const countersFeatures = features.features;
        countersFeatures.map(cf => cf.counter = cf.counter - amount);
        axios.put<any, any, CountersFeature>(mocksUrl + '/counters/' + iban, {
                id: iban,
                features: countersFeatures
            }
        ).then(() => console.log('counters updated successfully'))
            .catch(err => console.log('error updating counters state, retrying later', err));
    }

}
