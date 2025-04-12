// piston.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { of, throwError } from 'rxjs';
import { PistonService } from './piston.service';
import { PistonExecuteDto } from './dto/piston-execute.dto';
import { Language, LanguageVersions } from './enums/language.enum';
import { AxiosError } from 'axios';

describe('PistonService', () => {
  let service: PistonService;
  let httpService: HttpService;

  const mockExecuteDto: PistonExecuteDto = {
    language: Language.JAVASCRIPT,
    code: 'console.log("hello")',
    stdin: 'input',
    time_limit: 5000,
    memory_limit: 512000,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PistonService,
        {
          provide: HttpService,
          useValue: {
            post: jest.fn(() =>
              of({
                data: {
                  run: { stdout: '  output  ', stderr: '  error  ' },
                },
              }),
            ),
          },
        },
      ],
    }).compile();

    service = module.get<PistonService>(PistonService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('executeCode', () => {
    it('should execute code successfully', async () => {
      const result = await service.executeCode(mockExecuteDto);

      expect(result).toEqual({
        stdout: 'output',
        stderr: 'error',
      });

      expect(httpService.post).toHaveBeenCalledWith(
        'https://emkc.org/api/v2/piston/execute',
        {
          language: Language.JAVASCRIPT,
          version: LanguageVersions[Language.JAVASCRIPT],
          files: [{ content: 'console.log("hello")' }],
          stdin: 'input',
          run_timeout: 5000,
          run_memory_limit: 512000,
        },
      );
    });

    it('should throw BadRequestException for unsupported language', async () => {
      const invalidDto = { ...mockExecuteDto, language: 'unsupported' };

      // @ts-expect-error: Testing invalid language type
      await expect(service.executeCode(invalidDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should handle API errors and throw InternalServerErrorException', async () => {
      const axiosError = {
        response: {
          data: { message: 'API error' },
          status: 500,
          statusText: 'Internal Server Error',
          headers: {},
          config: {},
        },
        isAxiosError: true,
        name: 'AxiosError',
        message: 'Request failed',
      } as AxiosError;

      jest
        .spyOn(httpService, 'post')
        .mockImplementationOnce(() => throwError(() => axiosError));

      await expect(service.executeCode(mockExecuteDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });

    it('should handle network errors without response', async () => {
      const axiosError = {
        isAxiosError: true,
        name: 'AxiosError',
        message: 'Network Error',
        config: {},
      } as AxiosError;

      jest
        .spyOn(httpService, 'post')
        .mockImplementationOnce(() => throwError(() => axiosError));

      await expect(service.executeCode(mockExecuteDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
