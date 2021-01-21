using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Claims;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
using Web_Api.Controllers;
using Web_Api.Helper;
using Web_Api.Infrastructure;
using Web_Api.Security;

namespace Web_Api.Handlers
{
    public class AuthenticationHandler : DelegatingHandler
    {

        private Dictionary<string, List<string>> _public_No_JWT_List = new Dictionary<string, List<string>>()
        {
            {
                "/api",
                new List<string>() { HttpMethod.Get.Method }
            },
            {
                 "/api/AuthToken",
                 new List<string>() { HttpMethod.Post.Method }
            },
            {
                 "/weatherforecast",
                 new List<string>() { HttpMethod.Get.Method }
            }
        };

        private readonly RequestDelegate _next;
        public AuthenticationHandler(RequestDelegate next)
        {
            this._next = next;
        }
        //private readonly AuthenticationHandler _options;
        //public AuthenticationHandler(RequestDelegate next, IOptions<AuthenticationHandler> options)
        //{
        //    this._next = next;
        //    this._options = options.Value;

        //}

        public async Task Invoke(HttpContext context)
        {
            //}
            //public async Task<HttpResponseMessage> SendAsync(HttpRequestMessage request)
            //{
            JWTToken oJwt = null;
            var response = new HttpResponseMessage();
            try
            {
                // skip the options requests 
                bool listContains = false;
                foreach (KeyValuePair<string, List<string>> item in _public_No_JWT_List)
                {
                    if (context.Request.Path.Value.ToLower().TrimEnd('/').Equals(item.Key.ToLower()))
                    {
                        listContains = item.Value.Contains(context.Request.Method);
                        break;
                    }
                }
                // Determine whether the client is accessing a Public controller, if not check for token
                if ((!listContains))
                {
                    var headers = context.Request.Headers;
                    string token = string.Empty;

                    if (headers.ContainsKey(JWTToken.JWT_ID))
                        token = headers[JWTToken.JWT_ID].First();
                    try
                    {
                        var hmacKey = AESServices.UserHmacKey(Constants.UserNumber, 3);
                        //var t = token.AESStringDecryption(Constants.UserNumber);
                        oJwt = JWTToken.ParseJwtToken(token.AESStringDecryption(Constants.UserNumber), ref hmacKey);

                        // Set Principal and store JWT
                        ClaimsIdentity id = new ClaimsIdentity(oJwt.Claims, JWTToken.JWT_ID);
                        id.BootstrapContext = oJwt;
                        ClaimsPrincipal principal = new ClaimsPrincipal(id);
                        Thread.CurrentPrincipal = new ClaimsPrincipal(id);
                    }
                    catch (Exception ex)
                    {
                        throw new Exception("Session Not Found");
                    }                  
                }
            }
            catch (Exception ex)
            {
                HttpResponseMessage exceptionResponse = new HttpResponseMessage(HttpStatusCode.BadRequest);
                context.Response.StatusCode = Convert.ToInt32(HttpStatusCode.BadRequest);
                context.Response.ContentType = "application/json; charset=utf-8";
                var result = ex.ToString() + "An error occurred processing your authentication.";
                await context.Response.WriteAsync(result);
            }
            }
    }
}
