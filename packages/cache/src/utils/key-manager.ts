/**
 * Utility for managing cache keys
 */
export class KeyManager {
  private readonly delimiter: string;
  private readonly baseKey: string;

  /**
   * Create a new key manager
   * @param baseKey The base key prefix
   * @param delimiter The delimiter to use between key parts
   */
  constructor(baseKey: string = "praxisnotes", delimiter: string = ":") {
    this.baseKey = baseKey;
    this.delimiter = delimiter;
  }

  /**
   * Create a namespaced key
   * @param namespace The namespace for the key
   * @param parts Additional parts to include in the key
   * @returns The full key string
   */
  create(namespace: string, ...parts: (string | number)[]): string {
    const validParts = parts.filter(
      (part) => part !== undefined && part !== null && part !== "",
    );

    return [this.baseKey, namespace, ...validParts]
      .map(String)
      .join(this.delimiter);
  }

  /**
   * Create a namespaced key pattern for querying
   * @param namespace The namespace for the key
   * @param pattern The pattern to match
   * @returns The full key pattern
   */
  pattern(namespace: string, pattern: string = "*"): string {
    return `${this.baseKey}${this.delimiter}${namespace}${this.delimiter}${pattern}`;
  }

  /**
   * Create a key for an entity by ID
   * @param entityType The type of entity (e.g., "user", "behavior")
   * @param id The entity ID
   * @returns The full entity key
   */
  entity(entityType: string, id: string | number): string {
    return this.create(entityType, String(id));
  }

  /**
   * Create a key for a list of entities
   * @param entityType The type of entity (e.g., "users", "behaviors")
   * @param filter Optional filter criteria
   * @returns The full list key
   */
  list(entityType: string, filter?: Record<string, string | number>): string {
    if (!filter || Object.keys(filter).length === 0) {
      return this.create(`${entityType}:list`);
    }

    // Sort keys for consistent key generation
    const sortedEntries = Object.entries(filter).sort(([a], [b]) =>
      a.localeCompare(b),
    );

    // Create filter string
    const filterParts = sortedEntries.map(([key, value]) => `${key}:${value}`);

    return this.create(`${entityType}:list`, ...filterParts);
  }

  /**
   * Create a key with expiry information
   * @param key The base key
   * @param expirySeconds Expiry time in seconds
   * @returns The key with expiry information
   */
  withExpiry(key: string, expirySeconds: number): string {
    return `${key}${this.delimiter}exp${this.delimiter}${expirySeconds}`;
  }
}
