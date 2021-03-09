using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Web_Api.Security;

namespace Web_Api.Helper
{
    public static class EncryptHelper
    {
        
        public static string ToBase64String(this string input)
        {
            return Convert.ToBase64String(Encoding.UTF8.GetBytes(input)).TrimEnd('=').Replace('+', '-').Replace('/', '_');
        }
        public static string ToBase64String(this byte[] input)
        {
            return Convert.ToBase64String(input).TrimEnd('=').Replace('+', '-').Replace('/', '_');
        }

        public static byte[] ToByteArray(this string input)
        {
            input = input.Replace('-', '+').Replace('_', '/');
            var pad = 4 - (input.Length % 4);
            pad = pad > 2 ? 0 : pad;
            input = input.PadRight(input.Length + pad, '=');
            return Convert.FromBase64String(input);
        }

        public static byte[] ToByteArray(this string input, ref string input1)
        {
            input = input.Replace('-', '+').Replace('_', '/');
            var pad = 4 - (input.Length % 4);
            pad = pad > 2 ? 0 : pad;
            input = input.PadRight(input.Length + pad, '=');
            input1 = input;
            return Convert.FromBase64String(input);
        }

        public static string AESStringEncryption(this string data, int UserNo)
        {
            return AESServices.AESDataEncryption(data, 1, UserNo);
        }

        public static string AESStringDecryption(this string data, int UserNo)
        {
            return AESServices.AESDataDecryption(data, 1, UserNo);
        }


    }
}
