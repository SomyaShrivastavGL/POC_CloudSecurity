using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
using Web_Api.Controllers;
using Web_Api.Helper;
using Web_Api.Infrastructure;
using Web_Api.Security;

namespace Web_Api.Handlers
{
    public static class AuthenticationHandlerExtension
    {
        public static IApplicationBuilder UseAuthenticationHandler(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<AuthenticationHandler>();
        }
    }
}
