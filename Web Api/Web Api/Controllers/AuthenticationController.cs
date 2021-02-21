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

namespace Web_Api.Controllers
{
    [Route("api/AuthToken")]
    [ApiController]
    public class AuthenticationController : Controller
    {
        [HttpPost]
        public HttpResponseMessage AuthenticatedToken(Users user)
        {
            UserController userController = new UserController();
            var isUserValid = userController.CheckUser(user);
            var response = new HttpResponseMessage();
            try
            {
                if (isUserValid.StatusCode == HttpStatusCode.OK)
                {
                    var tokenService = new TokenService();
                    var token = tokenService.GenerateJWT(user);
                    response.Headers.Add(JWTToken.Authorization, token.ToString().AESStringEncryption(Constants.UserNumber));
                    response.StatusCode = HttpStatusCode.OK;
                }
                else
                    response.StatusCode = HttpStatusCode.NotFound;
                return response;
            }
            catch(Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}
