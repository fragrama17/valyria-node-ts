import {SimpleFeature, Validator, ValidatorOutcome} from "../validator";
import axios, {AxiosResponse} from "axios";
import {mocksUrl} from "../../config/dev";

export class MaxValidator implements Validator<SimpleFeature> {

    getFeatures(iban: string): Promise<AxiosResponse<SimpleFeature>> {
        return axios.get<SimpleFeature>(mocksUrl + `/features/${iban}`);
    }

    validate(amount: number, features: SimpleFeature): ValidatorOutcome {
        const maxAmount = features.list.find(value => value.name === "MAXIMUM")?.amount || 0;

        return {
            isValid: maxAmount >= amount
        }
    }

    updateState(amount: number, iban: string, features: SimpleFeature): void {
        // nothing to update
    }

}
