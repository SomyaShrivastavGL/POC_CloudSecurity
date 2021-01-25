using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Security.Cryptography;
using System.Security.Claims;
using Web_Api.Security;
using System.IO;
using Newtonsoft.Json;
using System.Text;
using Web_Api.Helper;

namespace Web_Api.Infrastructure
{
    public class JWTToken
    {
        public const string HMACSHA256 = "HS256";

        private const string Header_Issuer = "iss";
        private const string Header_Audience = "aud";
        private const string Header_TimeOut = "to";
        public const string JWT_ID = "JWT";
        private byte[] signKeyBytes;

        private string mCachedJWTString = String.Empty;
        private bool mIsUpdated = false;
        private Dictionary<string, string> mClaims = new Dictionary<string, string>(); 
        //private string _HMACKEY = null;
        public JWTToken()
        {

        }

        public void AddClaim(string claimType, string value)
        {
            if(this.mClaims.ContainsKey(claimType))
            {
                this.mClaims[claimType] = string.Format("{0},{1}", this.mClaims[claimType], value);
            }
            else
            {
                this.mClaims.Add(claimType, value);
                mIsUpdated = true;
            }
        }

        private void UpdateClaim(string claim, string value)
        {
            if (this.mClaims.ContainsKey(claim))
            {
                this.mClaims[claim] = value;
            }
            else
            {
                this.mClaims.Add(claim, value);
                mIsUpdated = true;
            }
        }
        [JsonIgnore]
        public List<Claim> Claims
        {
            get
            {
                var list = new List<Claim>();
                foreach(KeyValuePair<string, string> kvp in mClaims)
                {
                    list.Add(new Claim(kvp.Key, kvp.Value));
                }
                return list;
            }
        }

        public string Issuer
        {
            get
            {
                return this.mClaims.ContainsKey(Header_Issuer) ? this.mClaims[Header_Issuer] : string.Empty;
            }
            set
            {
                UpdateClaim(Header_Issuer, value);
            }
        }

        public string Audience
        {
            get
            {
                return this.mClaims.ContainsKey(Header_Audience) ? this.mClaims[Header_Audience] : string.Empty;
            }
            set
            {
                UpdateClaim(Header_Audience, value);
            }
        }

        public string TimeOut
        {
            get
            {
                return this.mClaims.ContainsKey(Header_TimeOut) ? this.mClaims[Header_TimeOut] : string.Empty;
            }
            set
            {
                UpdateClaim(Header_TimeOut, value);
            }
        }


        public string symmetricSignatureKeyString {
            get { return Convert.ToBase64String(signKeyBytes); }
            set { signKeyBytes = Convert.FromBase64String(value); }
        }

        public byte[] symmetricSignatureKeyBytes
        {
            get { return signKeyBytes; }
            set { signKeyBytes = value; }
        }

        public string ToEncryptedString(int userNo)
        {
            return this.ToString().AESStringEncryption(userNo);
        }

        public override string ToString()
        {
            var sw = new StringWriter();
            var jtw = new JsonTextWriter(sw);
            jtw.WriteStartObject();
            jtw.WritePropertyName("JWT");
            jtw.WriteValue("JWT");
            jtw.WritePropertyName("alg");
            jtw.WriteValue(JWTToken.HMACSHA256);
            jtw.WriteEndObject();
            jtw.Close();

            var header = sw.ToString().ToBase64String();
            var claims = JsonConvert.SerializeObject(mClaims).ToBase64String();
            var signature = String.Empty;

            //Sign headers and claims with HMAC

            if(signKeyBytes == null)
            {
                throw new Exception("Signature key is missing");
            }
            using (HMACSHA256 hmac = new HMACSHA256(signKeyBytes))
            {
                var data = String.Format("{0}.{1}", header, claims);
                var signatureBytes = hmac.ComputeHash(Encoding.UTF8.GetBytes(data));
                signature = signatureBytes.ToBase64String();
            }

            // Encrypt Entire JWT with AES
            mCachedJWTString = String.Format("{0}.{1}.{2}", header, claims, signature);
            return mCachedJWTString;
        }

        public static JWTToken ParseJwtToken(string token, ref string SignatureKey)
        {
            var parts = token.Split('.');
            if (parts.Length != 3)
            {
                throw new Exception("Token is not formed properly");
            }
            //var header = Encoding.UTF8.GetString(parts[0].ToByteArray(ref parts[0]));
            //var claims = Encoding.UTF8.GetString(parts[1].ToByteArray(ref parts[1]));
            //var inSignature = parts[2].ToByteArray(ref parts[2]);
            var header = Encoding.UTF8.GetString(parts[0].ToByteArray());
            var claims = Encoding.UTF8.GetString(parts[1].ToByteArray());
            var inSignature = parts[2].ToByteArray();
            var computedSignature = String.Empty;

            var jwt = new JWTToken();
            jwt.symmetricSignatureKeyString = SignatureKey;
            jwt.mClaims = JsonConvert.DeserializeObject<Dictionary<string, string>>(claims);

            using (var HMAC = new HMACSHA256(Convert.FromBase64String(SignatureKey)))
            {
                var data = String.Format("{0}.{1}", parts[0], parts[1].Trim(System.Convert.ToChar("=")));
                var signatureBytes = HMAC.ComputeHash(Encoding.UTF8.GetBytes(data));
                computedSignature = signatureBytes.ToBase64String();
            }
            var inputSignature = inSignature.ToBase64String();
            //doing for now, need to remove below one line later
            inputSignature = parts[2];
            if (!computedSignature.Equals(inputSignature, StringComparison.Ordinal))
            {
                throw new Exception("Invalid Signature");
            }
                return jwt;
        }
    }
}
