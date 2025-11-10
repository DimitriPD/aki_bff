import { CoreClient } from '../../_shared/core/CoreClient';
export class GetEventQRUseCase { private coreClient = new CoreClient(); async execute(eventId: string) { return this.coreClient.getEventQR(eventId); } }
