import { CoreClient } from '../../_shared/core/CoreClient';
export class DeleteEventUseCase { private coreClient = new CoreClient(); async execute(eventId: string) { return this.coreClient.deleteEvent(eventId); } }
