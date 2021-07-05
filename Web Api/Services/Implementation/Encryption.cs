using Microsoft.Extensions.Options;
using Models;
using Services.Interfaces;
using System;
using System.IO;
using System.Security.Cryptography;

namespace Services.Implementation
{
    public class Encryption : IEncryption
    {
        private string _configurationKey;
        private string _configurationVector;

        public Encryption(IOptions<EncryptionSettings> options)
        {
            _configurationKey = options.Value.Key;
            _configurationVector = options.Value.Vector;
        }

        public string Decrypt(byte[] Cipher)
        {
            using (RijndaelManaged myRijndael = new RijndaelManaged())
            {
                myRijndael.Key = Convert.FromBase64String(_configurationKey);
                myRijndael.IV = Convert.FromBase64String(_configurationVector);

                return DecryptStringFromBytes(Cipher, myRijndael.Key, myRijndael.IV);
            }
        }

        private string DecryptStringFromBytes(byte[] Cipher, byte[] Key, byte[] IV)
        {
            // Check arguments.
            if (Cipher == null || Cipher.Length <= 0)
                throw new ArgumentNullException("cipherText");
            if (Key == null || Key.Length <= 0)
                throw new ArgumentNullException("Key");
            if (IV == null || IV.Length <= 0)
                throw new ArgumentNullException("IV");

            // Declare the string used to hold
            // the decrypted text.
            string plaintext = null;

            // Create an RijndaelManaged object
            // with the specified key and IV.
            using (RijndaelManaged rijAlg = new RijndaelManaged())
            {
                rijAlg.Key = Key;
                rijAlg.IV = IV;

                // Create a decryptor to perform the stream transform.
                ICryptoTransform decryptor = rijAlg.CreateDecryptor(rijAlg.Key, rijAlg.IV);

                // Create the streams used for decryption.
                using (MemoryStream msDecrypt = new MemoryStream(Cipher))
                {
                    using (CryptoStream csDecrypt = new CryptoStream(msDecrypt, decryptor, CryptoStreamMode.Read))
                    {
                        using (StreamReader srDecrypt = new StreamReader(csDecrypt))
                        {
                            // Read the decrypted bytes from the decrypting stream
                            // and place them in a string.
                            plaintext = srDecrypt.ReadToEnd();
                        }
                    }
                }
            }

            return plaintext;
        }

        public byte[] Encrypt(string PlainText)
        {
            using (RijndaelManaged myRijndael = new RijndaelManaged())
            {

                myRijndael.Key = Convert.FromBase64String(_configurationKey);
                myRijndael.IV = Convert.FromBase64String(_configurationVector);
                return EncryptStringToBytes(PlainText, myRijndael.Key, myRijndael.IV);
            }
        }

        private byte[] EncryptStringToBytes(string PlainText, byte[] Key, byte[] IV)
        {
            // Check arguments.
            if (PlainText == null || PlainText.Length <= 0)
                throw new ArgumentNullException("plainText");
            if (Key == null || Key.Length <= 0)
                throw new ArgumentNullException("Key");
            if (IV == null || IV.Length <= 0)
                throw new ArgumentNullException("IV");
            byte[] encrypted;
            // Create an RijndaelManaged object
            // with the specified key and IV.
            using (RijndaelManaged rijAlg = new RijndaelManaged())
            {
                rijAlg.Key = Key;
                rijAlg.IV = IV;

                // Create an encryptor to perform the stream transform.
                ICryptoTransform encryptor = rijAlg.CreateEncryptor(rijAlg.Key, rijAlg.IV);

                // Create the streams used for encryption.
                using (MemoryStream msEncrypt = new MemoryStream())
                {
                    using (CryptoStream csEncrypt = new CryptoStream(msEncrypt, encryptor, CryptoStreamMode.Write))
                    {
                        using (StreamWriter swEncrypt = new StreamWriter(csEncrypt))
                        {

                            //Write all data to the stream.
                            swEncrypt.Write(PlainText);
                        }
                        encrypted = msEncrypt.ToArray();
                    }
                }
            }

            // Return the encrypted bytes from the memory stream.
            return encrypted;
        }
    }

}
