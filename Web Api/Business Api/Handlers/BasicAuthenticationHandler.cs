using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Text;
using System.Text.Encodings.Web;
using System.Threading.Tasks;

namespace Web_Api.Handlers
{
    public class BasicAuthenticationHandler : AuthenticationHandler<AuthenticationSchemeOptions>
    {
        public BasicAuthenticationHandler(IOptionsMonitor<AuthenticationSchemeOptions> options, ILoggerFactory logger, UrlEncoder encoder, ISystemClock clock) : base(options, logger, encoder, clock) { }
        protected override async Task<AuthenticateResult> HandleAuthenticateAsync()
        {
            try
            {
                if (!Request.Headers.ContainsKey("Authorization"))
                {
                    return AuthenticateResult.Fail("Authorization header was not found");
                }
                var authenticationHeaderValue = AuthenticationHeaderValue.Parse(Request.Headers["Authorization"]);
                var bytes = Convert.FromBase64String(authenticationHeaderValue.Parameter);
                string[] credentials = Encoding.UTF8.GetString(bytes).Split(":");
                string emailAddress = credentials[0];
                string pass = credentials[1];

                //user check in database
                object user = null;
                //if (user == null)
                //{ }
                //else
                //{
                    var claims = new[] { new Claim(ClaimTypes.Name, emailAddress) };
                    var claimIdentity = new ClaimsIdentity(claims, Scheme.Name);
                    var principal = new ClaimsPrincipal(claimIdentity);
                    var ticket = new AuthenticationTicket(principal, Scheme.Name);

                  return  AuthenticateResult.Success(ticket);
       //         }
            }

            catch (Exception)
            {
                return AuthenticateResult.Fail("Error");
            }
            return AuthenticateResult.Fail("Error");
        }
    }
}
