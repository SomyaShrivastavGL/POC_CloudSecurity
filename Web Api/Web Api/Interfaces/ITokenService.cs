using Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Web_Api.Infrastructure;
using Web_Api.Models;

namespace Web_Api.Interfaces
{
    interface ITokenService
    {
        WebApiToken GenerateJWT(Users user);

        string GenerateRefreshToken();

        ClaimsPrincipal GetPrincipalFromExpiredToken(string token);
    }
}
