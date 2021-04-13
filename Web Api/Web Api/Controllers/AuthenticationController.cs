using Microsoft.AspNetCore.Mvc;
using Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Web_Api.Controllers;
using System.Net;
using Web_Api.Infrastructure;
using Web_Api.Helper;
using Web_Api.Security;
using Web_Api.Models;
using Microsoft.Extensions.Configuration;

namespace Web_Api.Controllers
{
    
    [ApiController]
    public class AuthenticationController : Controller
    {
        UserController userController;
       public AuthenticationController(IConfiguration configurations)
        {
            userController = new UserController(configurations);
        }

        [HttpPost]
        [Route("api/AuthToken")]
        public HttpResponseMessage AuthenticatedToken(Users user)
        {
            var response = new HttpResponseMessage();
            try
            {
                var userData = userController.GetAuthorizationEmployee(user.Email);
                //var userData = new Users { EmployeeName = "abc", Email = "abc123@gmail.com", IsAdmin = true };
                if (userData != null)
                {
                    var tokenService = new TokenService();
                    var apiTokens = tokenService.GenerateJWT(userData);
                    response.StatusCode = HttpStatusCode.OK;
                    response.Headers.Add(JWTToken.Authorization, apiTokens.accessToken.ToString().AESStringEncryption(Constants.UserNumber));
                    response.Headers.Add("RefreshToken", apiTokens.refreshToken);
                }
                else
                {
                    response.StatusCode = HttpStatusCode.Unauthorized;
                }
                return response;
            }
            catch(Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        [HttpPost]
        [Route("api/refresh")]
        public HttpResponseMessage Refresh(WebApiToken tokenApiModel)
        {
            if (tokenApiModel is null)
            {
                return new HttpResponseMessage(HttpStatusCode.BadRequest);
            }
            var accessToken = tokenApiModel.expiredToken;
            string refreshToken = tokenApiModel.refreshToken;
            var tokenService = new TokenService();
            var principal = tokenService.GetPrincipalFromExpiredToken(accessToken);
            //var userName = principal.Identity.Name; //this is mapped to the Name claim by default
            var claims = ((System.Security.Claims.ClaimsIdentity)principal.Identity).Claims.ToList();
            var userName = claims[1].Value;
            var userIsAdmin = Convert.ToBoolean(claims[6].Value);
            var userEmail = claims[2].Value;

            var user = userController.GetAuthorizationEmployee(userEmail);

            //if (user == null || user.RefreshToken != refreshToken)
            //{
            //    return BadRequest("Invalid client request");
            //}

            var token = tokenService.GenerateJWT(new Users { EmployeeName= userName, Email= userEmail, IsAdmin = userIsAdmin});
            //userContext.SaveChanges();
            var response = new HttpResponseMessage();
            response.StatusCode = HttpStatusCode.OK;
            response.Headers.Add(JWTToken.Authorization, token.accessToken.ToString().AESStringEncryption(Constants.UserNumber));
            response.Headers.Add("RefreshToken", token.refreshToken);
            return response;
        }
    }
}
