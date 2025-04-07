import { IsEnum, IsString } from 'class-validator';
import { ProviderType } from './providerType.enum';

export class Provider {
  @IsString()
  provider_id: string; // Unique ID from the provider (e.g., Google's sub)

  @IsEnum(ProviderType)
  type: ProviderType;

  constructor() {
    Object.assign(this);
  }
}
