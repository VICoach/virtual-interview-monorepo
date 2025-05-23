import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import type { AxiosError } from 'axios';
import { PistonExecuteDto } from './dto/piston-execute.dto';
import { LanguageVersions } from './enums/language.enum';
import { PistonExecutionResponse } from './interfaces/piston-execution-response.interface';

@Injectable()
export class PistonService {
  private readonly logger = new Logger(PistonService.name);
  private readonly pistonBaseUrl: string = 'https://emkc.org/api/v2/piston';

  constructor(private readonly httpService: HttpService) {}

  async executeCode(
    dto: PistonExecuteDto,
  ): Promise<{ stdout: string; stderr: string }> {
    this.logger.log(`Executing code in ${dto.language}`);
    // this.logger.debug('dto: ', dto);

    const version = LanguageVersions[dto.language];
    if (!version) {
      this.logger.warn(`Unsupported language requested: ${dto.language}`);
      throw new BadRequestException(`Unsupported language: ${dto.language}`);
    }

    try {
      const response = await lastValueFrom(
        this.httpService.post<PistonExecutionResponse>(
          `${this.pistonBaseUrl}/execute`,
          {
            language: dto.language,
            version,
            files: [{ content: dto.code }],
            stdin: dto.stdin,
            run_timeout: dto.time_limit,
            run_memory_limit: dto.memory_limit,
          },
        ),
      );

      // this.logger.debug(
      //   `Code execution completed for ${dto.language} ` +
      //     `(Status: ${response.status})`,
      // );

      return {
        stdout: response.data.run.stdout.trim() || '',
        stderr: response.data.run.stderr.trim() || '',
      };
    } catch (error) {
      const axiosError = error as AxiosError;
      this.logger.error(
        'Piston API Error:',
        axiosError.response?.data || axiosError.message,
      );
      throw new InternalServerErrorException('Failed to execute code');
    }
  }
}
