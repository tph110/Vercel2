// No persistent storage needed for this application
// All processing is stateless - images are analyzed and results returned immediately

export interface IStorage {
  // No storage methods needed for this stateless application
}

export class MemStorage implements IStorage {
  constructor() {}
}

export const storage = new MemStorage();
