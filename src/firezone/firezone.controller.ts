import { Controller, Get } from '@nestjs/common';
import { FirezoneService } from './firezone.service';
import { firezone } from './firezone.entity';

@Controller('firezone')
export class FirezoneController {
    constructor(private FirezoneService: FirezoneService) {}
    
    @Get()
    async findAll(): Promise<firezone[]> {
        return this.FirezoneService.findAll();
    }
}
