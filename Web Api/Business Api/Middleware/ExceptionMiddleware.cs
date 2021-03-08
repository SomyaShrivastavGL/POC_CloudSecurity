using Microsoft.AspNetCore.Http;
using Serilog;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace Business_Api.Middleware
{
    public class ExceptionMiddleware
    {
        private RequestDelegate _next;
        public ExceptionMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                context.Request.EnableBuffering();
                if (context.Request.Body.CanSeek)
                    context.Request.Body.Seek(0, SeekOrigin.Begin);
                string rawRequest;
                using (var reader = new StreamReader(context.Request.Body))
                    rawRequest = await reader.ReadToEndAsync();
                Log.Information($"Request received on: {context.Request.Path} from {context.Request.HttpContext.Connection.RemoteIpAddress}");
                Log.Verbose($"Raw Request: {rawRequest}");
                
                await _next(context);
            }
            catch (Exception ex)
            {
                Log.Error(ex, "");
                context.Response.StatusCode =(int)HttpStatusCode.InternalServerError;
                await context.Response.WriteAsync(ex.Message);
            }
        }
    }
}
