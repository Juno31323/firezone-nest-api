import { Injectable } from '@nestjs/common';
import { firezone } from './firezone.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class FirezoneService {
    constructor( 
        @InjectRepository(firezone)
        private FirezoneRepository: Repository<firezone>,
    ) {} 

    async findAll(): Promise<firezone[]> {
        return this.FirezoneRepository.find();
    }
}
