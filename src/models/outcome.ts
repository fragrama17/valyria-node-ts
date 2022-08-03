import mongoose, { Schema} from 'mongoose';

const outcomeSchema = new Schema({
    isValid: {
        type: Boolean,
        required: true
    },
    amount: {
        type: String,
        required: true
    },
    iban: {
        type: String,
        required: true
    },
    product: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        required: true
    },
    description: {
        type: String,
        required: false
    }

});

export const Outcome = mongoose.model('Outcome', outcomeSchema);