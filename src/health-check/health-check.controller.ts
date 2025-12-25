import { Controller, Get } from '@nestjs/common';

@Controller('/')
export class HealthCheckController {

    @Get()
    HealthCheck() {
        return 'Health check is up!!!'
    }
}
