using Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Web_Api.Security;
using Web_Api.Helper;
using System.Security.Claims;
using Web_Api.Interfaces;
using System.Security.Cryptography;
using Web_Api.Models;

namespace Web_Api.Infrastructure
{
    public class TokenService : ITokenService
    {
        public WebApiToken GenerateJWT(Users user)
        {
            var jwtToken = new JWTToken();
            jwtToken.AddClaim(ClaimTypes.NameIdentifier, "CPOC");
            jwtToken.AddClaim(ClaimTypes.Name, user.EmployeeName);
            jwtToken.AddClaim(ClaimTypes.Email, user.Email);
            jwtToken.Issuer = Constants.Issuer;
            jwtToken.Audience = Constants.Audience;
            jwtToken.TimeOut = "10";
            jwtToken.UserRole = user.Role;
            jwtToken.IsAdmin = user.IsAdmin;
            jwtToken.symmetricSignatureKeyString = AESServices.UserHmacKey(Constants.UserNumber, 3);
            var webApiToken = new WebApiToken();
            webApiToken.accessToken = jwtToken;
            webApiToken.refreshToken = GenerateRefreshToken();
            return webApiToken;
        }

        public string GenerateRefreshToken()
        {
            var randomNumber = new byte[32];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(randomNumber);
                return Convert.ToBase64String(randomNumber);
            }
        }

        public ClaimsPrincipal GetPrincipalFromExpiredToken(string token)
        {
            var hmacKey = AESServices.UserHmacKey(Constants.UserNumber, 3);
            var jwtToken = JWTToken.ParseJwtToken(token.AESStringDecryption(Constants.UserNumber), ref hmacKey);
            ClaimsIdentity id = new ClaimsIdentity(jwtToken.Claims, JWTToken.JWT_ID);
            id.BootstrapContext = jwtToken;
            ClaimsPrincipal principal = new ClaimsPrincipal(id);
            return principal;
        }
    }     
}
