import { Controller, Get, Logger, Post, Req, Res } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentSessionDto } from './dtos/payment-session.dto';
import { Request, Response } from 'express';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  private logger = new Logger('Payments-controller')

  // @Post('create-payment-session')
  @MessagePattern('create.payment.session')
  createPaymentSession(@Payload() paymentSessionDtos: PaymentSessionDto){
    return this.paymentsService.createPaymentService(paymentSessionDtos);
  }

  @Get('success')
  success(){
    return {
      ok: true,
      message: 'Payment succesful'
    }
  }

  @Get('cancel')
  cancel(){
    return {
      ok: false,
      message: 'Payment cancelled'
    }
  }

  @Post('webhook')
  async stripeWebhook(@Req() req: Request, @Res() res: Response){
    return this.paymentsService.stripeWebhook(req, res);
  }
}
