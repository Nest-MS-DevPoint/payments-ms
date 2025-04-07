import { Injectable, Logger } from '@nestjs/common';
import { vars } from 'src/config';
import Stripe from 'stripe'
import { PaymentSessionDto } from './dtos/payment-session.dto';
import { Request, Response } from 'express';

@Injectable()
export class PaymentsService {

    private logger = new Logger('PaymentsService')


    private readonly stripe = new Stripe(
        vars.stripeSecret
    )

    async createPaymentService(paymentSessionDtos: PaymentSessionDto) {

        const { currency, items, orderId } = paymentSessionDtos;

        const lineItems = items.map(item => {
            return {
                price_data: {
                    currency: currency,
                    product_data: {
                        name: item.name
                    },
                    unit_amount: Math.round(item.price * 100) // $20 => 2000/100 = 20.00
                },
                quantity: item.quantity
            }
        })




        const session = this.stripe.checkout.sessions.create({
            // ID de la orden
            payment_intent_data: {
                metadata: {
                    orderId: orderId
                }
            },
            line_items: lineItems,
            mode: 'payment',
            success_url: vars.stripeSuccessUrl,
            cancel_url: vars.stripeCancelUrl

        })

        return session
    }

    async stripeWebhook(req: Request, res: Response) {
        const sig = req.headers['stripe-signature'];

        let event: Stripe.Event;
        
        const endpointSecret = vars.stripeEndpointSecret

        try {
            this.logger.log(sig)
            event = this.stripe.webhooks.constructEvent(req['rawBody'], sig!, endpointSecret);
            
            this.logger.log({event})
            
            switch (event.type) {
                case 'charge.succeeded':
                    const chargeSucceeded = event.data.object;
                    this.logger.log({
                        metadata: chargeSucceeded.metadata
                    })
                    break
                default:
                    this.logger.log(`Event ${event.type} not handled`)
            }
        }
        catch (err) {
            res.status(400).send(`Webhook Error: ${err.message}`);
        }


        return res.status(200).json({ sig })
    }
}
