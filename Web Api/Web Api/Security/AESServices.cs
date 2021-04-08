using Microsoft.VisualBasic;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Security.Cryptography;
using System.IO;

namespace Web_Api.Security
{
    public class AESServices
    {

        //public static void UserKey(int UserNo, ref string key, ref string iv, int SetID=1)
        public static string  UserHmacKey(int UserNo, int SetID = 1)
        {
            StringBuilder KeySB = new StringBuilder();
            StringBuilder InitVectorSB = new StringBuilder();
            KeySB.Append(generateRandomHexString(UserNo, SetID, true));
            KeySB.Append(generateRandomHexString(UserNo, SetID, false));
            KeySB.Append(generateRandomHexString(UserNo, SetID + 1, true));
            KeySB.Append(generateRandomHexString(UserNo, SetID + 1, false));
            //InitVectorSB.Append(generateRandomHexString(UserNo, SetID + 2, true));
            //InitVectorSB.Append(generateRandomHexString(UserNo, SetID + 2, false));
            return KeySB.ToString();
            //iv = InitVectorSB.ToString();

        }
        public static string generateRandomHexString(int userNumber, int setID, bool userAlternativeValues = false)
        {
            var start = 0;
            var HexString = String.Empty;
            var key = "";
            VBMath.Rnd(-1);
            if (userAlternativeValues)
            {
                HexString = "0123456789ABCDEF";
                VBMath.Randomize((userNumber + setID) * (Math.Pow(3, setID)));
            }
            else
            {
                HexString = "FEDCBA0123456789";
                VBMath.Randomize((userNumber + setID) * (Math.Pow(4, setID)));
            }
            for(int i=1; i<=16; i++)
            {
                start = Convert.ToInt32(Conversion.Int((16 * VBMath.Rnd()) + 1));
                key += HexString.Substring(start - 1, 1); 
            }
            return key;
        }

        public static byte[] HexToByteArray(string HexString)
        {
            var list = new List<byte>();
            for (int i = 0; i <= HexString.Length - 2; i += 2)
                list.Add(byte.Parse(HexString.Substring(i, 2), System.Globalization.NumberStyles.HexNumber));
            return list.ToArray();
        }
        public static string AESDataEncryption(string data, int SetID = 1, int UserNo = -1)
        {
            StringBuilder Key = new StringBuilder();
            StringBuilder InitVector = new StringBuilder();
            Key.Append(generateRandomHexString(UserNo, SetID, true));
            Key.Append(generateRandomHexString(UserNo, SetID, false));
            Key.Append(generateRandomHexString(UserNo, SetID + 1, true));
            Key.Append(generateRandomHexString(UserNo, SetID + 1, false));
            InitVector.Append(generateRandomHexString(UserNo, SetID + 2, true));
            InitVector.Append(generateRandomHexString(UserNo, SetID + 2, false));

            using (AesCryptoServiceProvider aesCryptoserviceProvider = new AesCryptoServiceProvider())
            {
                aesCryptoserviceProvider.Key = HexToByteArray(Key.ToString());
                aesCryptoserviceProvider.IV = HexToByteArray(InitVector.ToString());
                aesCryptoserviceProvider.Mode = CipherMode.CBC;
                aesCryptoserviceProvider.Padding = PaddingMode.ISO10126;
                MemoryStream memoryStream = null;
                CryptoStream cryptoStream = null;
                try
                {
                    memoryStream = new MemoryStream();
                    cryptoStream = new CryptoStream(memoryStream, aesCryptoserviceProvider.CreateEncryptor(), CryptoStreamMode.Write);
                    byte[] inBytes = System.Text.UnicodeEncoding.Unicode.GetBytes(data);
                    cryptoStream.Write(inBytes, 0, inBytes.Length);
                    cryptoStream.FlushFinalBlock();

                    return Convert.ToBase64String(memoryStream.ToArray());
                }
                finally
                {
                    if(cryptoStream != null)
                    {
                        memoryStream = null;
                        cryptoStream.Dispose();
                    }

                    if(memoryStream != null)
                    {
                        memoryStream.Dispose();
                    }
                }
            }
        }
       
        public static string AESDataDecryption(string data, int SetID = 1, int UserNo = -1)
        {
            StringBuilder Key = new StringBuilder();
            StringBuilder InitVector = new StringBuilder();
            Key.Append(generateRandomHexString(UserNo, SetID, true));
            Key.Append(generateRandomHexString(UserNo, SetID, false));
            Key.Append(generateRandomHexString(UserNo, SetID + 1, true));
            Key.Append(generateRandomHexString(UserNo, SetID + 1, false));
            InitVector.Append(generateRandomHexString(UserNo, SetID + 2, true));
            InitVector.Append(generateRandomHexString(UserNo, SetID + 2, false));

            using (AesCryptoServiceProvider aesCryptoserviceProvider = new AesCryptoServiceProvider())
            {
                aesCryptoserviceProvider.Key = HexToByteArray(Key.ToString());
                aesCryptoserviceProvider.IV = HexToByteArray(InitVector.ToString());
                aesCryptoserviceProvider.Mode = CipherMode.CBC;
                aesCryptoserviceProvider.Padding = PaddingMode.ISO10126;
                data=data.Replace("Bearer ","");
 

                 var inBytes = Convert.FromBase64String(data);
                MemoryStream memoryStream = null;
                CryptoStream cryptoStream = null;
                try
                {
                    memoryStream = new System.IO.MemoryStream(inBytes);
                    cryptoStream = new CryptoStream(memoryStream, aesCryptoserviceProvider.CreateDecryptor(), CryptoStreamMode.Read);

                    byte[] outBytes = new byte[inBytes.Length + 1];
                    var lengthDecrypted = cryptoStream.Read(outBytes, 0, outBytes.Length);

                    return System.Text.UnicodeEncoding.Unicode.GetString(outBytes, 0, lengthDecrypted);
                }
                finally
                {
                    if (cryptoStream != null)
                    {
                        memoryStream = null;
                        cryptoStream.Dispose();
                    }

                    if (memoryStream != null)
                    {
                        memoryStream.Dispose();
                    }
                }
            }
        }
    }
}
