import { CoreClient } from '../../_shared/core/CoreClient';
interface CreateOccurrenceDTO { type: 'student_not_in_class' | 'manual_note' | 'invalid_qr' | 'duplicate_scan'; teacher_id: number; student_cpf?: string; class_id?: number; description: string; }
export class CreateOccurrenceUseCase { private coreClient = new CoreClient(); async execute(data: CreateOccurrenceDTO, _correlationId: string) { return this.coreClient.createOccurrence(data); } }
