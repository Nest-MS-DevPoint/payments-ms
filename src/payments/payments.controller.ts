import { Body, Controller, Get, Logger, Post, Req, Res } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentSessionDto } from './dtos/payment-session.dto';
import { Request, Response } from 'express';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  private logger = new Logger('Payments-controller')

  @Post('create-payment-session')
  createPaymentSession(@Body() paymentSessionDtos: PaymentSessionDto){
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
