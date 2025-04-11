import { ApiProperty } from '@nestjs/swagger';

export class CodeExecutionResult {
  @ApiProperty({ description: 'Whether the solution passed the test case' })
  success: boolean;

  @ApiProperty({ description: 'Expected output from the problem' })
  expected_output: string;

  @ApiProperty({ description: 'Actual output produced by the code' })
  actual_output: string;

  @ApiProperty({ description: 'Standard error output from execution' })
  stderr: string;

  @ApiProperty({
    description: 'Execution time in milliseconds',
    example: 150,
  })
  execution_time: number;
}
