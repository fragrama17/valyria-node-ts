import {Request, Response, Router} from 'express';
import {Outcome} from '../models/outcome';
import {composeValidators, SimpleFeature, Validator, ValidatorOutcome} from "../models/validator";
import axios from "axios";
import {mocksUrl} from "../config/dev";
import {InitValidator} from "../models/validators/InitValidator";

interface ValdaRequest {
    iban: string,
    amount: number,
    product: string
}

interface ProductFeatures {
    id: number,
    name: string,
    features: string[]
}

const router = Router();

router.post('/outcome', async (req: Request, res: Response): Promise<void> => {
    const valdaRequest: ValdaRequest = req.body;
    const {iban, amount, product} = valdaRequest;
    const responses: ValidatorOutcome[] = [];

    //business logic
    const productFeatures = await axios.get<ProductFeatures[]>(mocksUrl + '/products/?name=' + product);
    const validator: Validator<SimpleFeature> = new InitValidator();
    const features = await validator.getFeatures(iban, productFeatures.data[0].features[0]);
    // console.log(features.data);
    // responses.push(validator.validate(amount, features.data));

    new Outcome({
        isValid: true,
        amount: valdaRequest.amount,
        product: valdaRequest.product,
        iban: valdaRequest.iban,
        timestamp: new Date(),
    }).save()
        .then((outcome) => console.log("Outcome saved successfully !", outcome))
        .catch(error => console.log('Failed to save outcome', error));

    console.log("Outcome dispatched, returning response..");
    res.send(responses);
});

export {router};