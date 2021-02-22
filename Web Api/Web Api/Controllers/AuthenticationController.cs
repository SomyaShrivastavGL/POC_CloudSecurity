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

namespace Web_Api.Controllers
{
    
    [ApiController]
    public class AuthenticationController : Controller
    {
        [HttpPost]
        [Route("api/AuthToken")]
        public HttpResponseMessage AuthenticatedToken(Users user)
        {
            UserController userController = new UserController();
            //var isUserValid = userController.CheckUser(user);
           
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
        [Route("refresh")]
        public IActionResult Refresh(WebApiToken tokenApiModel)
        {
            if (tokenApiModel is null)
            {
                return BadRequest("Invalid client request");
            }
            var accessToken = tokenApiModel.expiredToken;
            string refreshToken = tokenApiModel.refreshToken;
            var tokenService = new TokenService();
            var principal = tokenService.GetPrincipalFromExpiredToken(accessToken);
            var userName = principal.Identity.Name; //this is mapped to the Name claim by default
            //var user = userContext.LoginModels.SingleOrDefault(u => u.UserName == username);
            //if (user == null || user.RefreshToken != refreshToken || user.RefreshTokenExpiryTime <= DateTime.Now)
            //{
            //    return BadRequest("Invalid client request");
            //}
            //var newAccessToken = tokenService.GenerateAccessToken(principal.Claims);
            var newAccessToken = tokenService.GenerateJWT(new Users { EmployeeName= userName});
            var newRefreshToken = tokenService.GenerateRefreshToken();
            //user.RefreshToken = newRefreshToken;
            //userContext.SaveChanges();
            return new ObjectResult(new
            {
                accessToken = newAccessToken,
                refreshToken = newRefreshToken
            });
        }
    }
}
