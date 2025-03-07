import { Inject, Injectable, Logger } from '@nestjs/common';
import { envs } from 'src/config/envs';
import Stripe from 'stripe';
import { PaymentSessionDto } from './dto/payment-session.dto';
import { Request, Response } from 'express';
import { SERVICES } from 'src/config';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class PaymentsService {
  private readonly stripe = new Stripe(envs.stripeSecret);
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    @Inject(SERVICES.NATS_SERVICE) private readonly client: ClientProxy,
  ) {}

  async createPaymentSession(paymentSessionDto: PaymentSessionDto) {
    const { currency, items, orderId } = paymentSessionDto;

    const lineItems = items.map((items) => {
      return {
        price_data: {
          currency: currency,
          product_data: {
            name: items.name,
          },
          unit_amount: Math.round(items.price * 100), // <- Esto seria como si fuese 20 dolares, ya que stripe trabaja con centavos
        },
        quantity: items.quantity,
      };
    });

    const session = this.stripe.checkout.sessions.create({
      // Colocar el id de la orden
      payment_intent_data: {
        metadata: {
          order_id: orderId,
        },
      },
      line_items: lineItems,
      mode: 'payment',
      success_url: envs.successUrl,
      cancel_url: envs.cancelUrl,
    });
    return session;
  }

  async stripeWebhook(req: Request, res: Response) {
    const sig = req.headers['stripe-signature'];

    let event: Stripe.Event;
    const endpointSecret = envs.secretEndpoint;

    try {
      event = this.stripe.webhooks.constructEvent(
        req['rawBody'],
        sig,
        endpointSecret,
      );
    } catch (error) {
      res.status(400).send(`Webhook Error: ${error.message}`);
      return;
    }

    switch (event.type) {
      case 'charge.succeeded':
        const chargeSucceeded = event.data.object;
        const payload = {
          stripePaymentId: chargeSucceeded.id,
          orderId: chargeSucceeded.metadata.order_id,
          receiptUrl: chargeSucceeded.receipt_url,
        };
        this.client.emit('payment.succeeded', payload);
        // this.logger.log({ payload });
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
        break;
    }

    return res.status(200).json({
      sig,
    });
  }
}
