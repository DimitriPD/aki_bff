import { CoreClient } from '../../_shared/core/CoreClient';
export class UpdateEventUseCase { private coreClient = new CoreClient(); async execute(eventId: string, data: any) { return this.coreClient.updateEvent(eventId, data); } }
