import {Request, Response, Router} from 'express';
import {Outcome} from '../models/outcome';
import {composeValidators, ValidatorOutcome} from "../models/validator";
import axios, {AxiosResponse} from "axios";
import {mocksUrl} from "../config/dev";

interface ProductFeatures {
    id: number,
    name: string,
    features: string[]
}

const router = Router();

router.post('/outcomes', async (req: Request, res: Response): Promise<void> => {
    const valyriaReq = req.body;
    const {iban, amount, product} = valyriaReq;
    const getFeatures: Promise<AxiosResponse>[] = [];
    const outcomes: ValidatorOutcome[] = [];
    let isValidRes = true;
    let errorDescription: string = '';

    try {
        // check amount
        if (typeof amount !== 'number' || amount < 0.01) {
            res.status(400);
            res.send({error: 'amount must be a positive number greater than 0.01'});
            return;
        }
        // check product for iban
        const productFeatures = await axios.get<ProductFeatures[]>(mocksUrl + '/products/?name=' + product);
        if (!productFeatures.data.length) {
            res.status(400);
            res.send({error: 'product not valid'});
            return;
        }

        const featureNames = productFeatures.data[0].features;

        // features to validate, empty array if none
        const validators = composeValidators(featureNames);
        validators.forEach(v => getFeatures.push(v.getFeatures(iban)));
        //async calls
        const featureValues = await Promise.all(getFeatures);

        validators.forEach((v, index) => outcomes.push(v.validate(amount, featureValues[index].data)));

        const badOutcomes = outcomes.filter(oc => !oc.isValid);
        if (!badOutcomes.length) //check if every outcome is true -> then update states
            validators.forEach((v, index) => v.updateState(amount, iban, featureValues[index].data));
        else {
            isValidRes = false;
            //appending errors if any
            badOutcomes.forEach(o => {
                errorDescription += o.error?.code + ': ' + o.error?.description + '; ';
            });
        }

        const outcome = new Outcome({
            isValid: isValidRes,
            amount: Number(amount.toFixed(2)),
            product: product,
            iban: iban,
            timestamp: new Date(),
            description: errorDescription ? errorDescription : undefined
        });

        outcome.save()
            .then(o => console.log("Outcome saved successfully !", o))
            .catch(error => console.log('Failed to save outcome', error));

        console.log("Outcome dispatched, returning response..");
        res.status(201);
        res.send(outcome);

    } catch (e) {
        const genericError = 'error computing request..';
        console.error(genericError, e);
        res.status(500);
        res.send({
            error: genericError,
            description: e
        });
    }
});

router.get('/outcomes', async (req: Request, res: Response): Promise<void> => {
    let page = Number(req.query.page);
    let pageSize = Number(req.query.pageSize);
    let iban = req.query.iban;
    let ibanQuery = {}

    if (!page || page < 0) page = 1;
    if (!pageSize || pageSize < 0) pageSize = 5;
    if (iban) ibanQuery = {iban: iban}
    //if page=1 nothing to skip -> page=0
    const outcomes = await Outcome.find(ibanQuery).skip((--page) * pageSize).limit(pageSize);

    res.send(outcomes);
});

export {router};
