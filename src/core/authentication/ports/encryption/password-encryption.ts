export abstract class PasswordEncryption {
  public abstract hash(plainText: string): Promise<string>;
  public abstract compare(plainText: string, hash: string): Promise<boolean>;
}
