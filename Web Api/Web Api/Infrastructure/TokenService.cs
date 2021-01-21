using Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Web_Api.Security;
using Web_Api.Helper;
using System.Security.Claims;

namespace Web_Api.Infrastructure
{
    public class TokenService
    {
        public JWTToken GenerateJWT(Users user)
        {
            var jwtToken = new JWTToken();
            jwtToken.AddClaim(ClaimTypes.NameIdentifier, "CPOC");
            jwtToken.Issuer = Constants.Issuer;
            jwtToken.Audience = Constants.Audience;
            jwtToken.TimeOut = "10";
            jwtToken.symmetricSignatureKeyString = AESServices.UserHmacKey(Constants.UserNumber, 3);
            return jwtToken;
        }
    }
}
