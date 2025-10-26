import { CoreClient } from '../../../infrastructure/http/clients/CoreClient';

interface CreateOccurrenceDTO {
  type: 'student_not_in_class' | 'manual_note' | 'invalid_qr' | 'duplicate_scan';
  teacher_id: number;
  student_cpf?: string;
  class_id?: number;
  description: string;
}

export class CreateOccurrenceUseCase {
  private coreClient: CoreClient;

  constructor() {
    this.coreClient = new CoreClient();
  }

  async execute(data: CreateOccurrenceDTO, correlationId: string): Promise<any> {
    // Create occurrence in Core microservice
    const result = await this.coreClient.createOccurrence(data);
    return result;
  }
}
