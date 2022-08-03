import {Request, Response, Router} from 'express';
import {Outcome} from '../models/outcome';
import {composeValidators, ValidatorOutcome} from "../models/validator";
import axios, {AxiosResponse} from "axios";
import {mocksUrl} from "../config/dev";

interface ProductFeatures {
    id: number,
    name: string,
    iban: string,
    features: string[]
}

const router = Router();

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

router.post('/outcomes', async (req: Request, res: Response): Promise<void> => {
    const valyriaReq = req.body;
    const {iban, amount, product} = valyriaReq;
    const getFeatures: Promise<AxiosResponse>[] = [];
    const outcomes: ValidatorOutcome[] = [];
    let isValidRes = true;
    let errorDescription: string = '';

    // check amount
    if (typeof amount !== 'number' || amount <= 0) {
        res.status(400);
        res.send({error: 'amount must be a positive number'});
        return;
    }
    //business logic starts
    const productFeatures = await axios.get<ProductFeatures[]>(mocksUrl + '/products/?name=' + product + '&iban=' + iban);
    if (!productFeatures.data.length) {
        res.status(400);
        res.send({error: 'product not valid'});
        return;
    }

    // features to validate, empty array if none
    const validators = composeValidators(productFeatures.data[0].features);
    validators.forEach((v, index) => getFeatures.push(v.getFeatures(iban, productFeatures.data[0].features[index])));
    //async calls
    const featuresResponses = await Promise.all(getFeatures);

    validators.forEach((v, index) => outcomes.push(v.validate(amount, featuresResponses[index].data)));
    //TODO update states
    if (!outcomes.filter(oc => !oc.isValid).length) //check if every outcome is true -> then update states
        validators.forEach((v, index) => v.updateState(amount, iban, featuresResponses[index].data));

    //appending errors
    outcomes.filter(o => !o.isValid).forEach(o => {
        isValidRes = false;
        errorDescription += o.error?.description + '; ';
    });

    const outcome = new Outcome({
        isValid: isValidRes,
        amount: amount.toFixed(2) + ' €',
        product: product,
        iban: iban,
        timestamp: new Date(),
        description: errorDescription ? errorDescription : undefined
    });

    outcome.save()
        .then((o) => console.log("Outcome saved successfully !", o))
        .catch(error => console.log('Failed to save outcome', error));

    console.log("Outcome dispatched, returning response..");
    res.status(201);
    res.send(outcome);
});


export {router};