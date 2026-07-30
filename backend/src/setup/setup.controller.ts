import { Body, Controller, Get, Post } from '@nestjs/common';
import { SetupService } from './setup.service';
import { InitialiserDto } from './dto/initialiser.dto';

// Endpoints publics (pas de JwtAuthGuard) : au tout premier lancement, aucun
// compte n'existe encore pour s'authentifier. La protection réelle contre un
// réemploi malveillant est le garde-fou "0 utilisateur" dans SetupService.
@Controller('setup')
export class SetupController {
  constructor(private service: SetupService) {}

  @Get('statut')
  statut() {
    return this.service.statut();
  }

  @Post('initialiser')
  initialiser(@Body() dto: InitialiserDto) {
    return this.service.initialiser(dto);
  }
}
