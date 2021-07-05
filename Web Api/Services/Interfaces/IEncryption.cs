namespace Services.Interfaces
{
    public interface IEncryption
    {
        byte[] Encrypt(string PlainText);
        string Decrypt(byte[] Cipher);
    }
}
