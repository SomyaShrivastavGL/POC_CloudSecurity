using Microsoft.AspNetCore.Http;
using Serilog;
using System;
using System.IO;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace Web_Api.Middleware
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
                var body = context.Request.Body;
                var buffer = new byte[(int)(context.Request.ContentLength ?? 0)];
                context.Request.EnableBuffering();

                if (context.Request.Body.CanSeek)
                    context.Request.Body.Seek(0, SeekOrigin.Begin);
                await context.Request.Body.ReadAsync(buffer, 0, buffer.Length);
                var bodyAsText = Encoding.UTF8.GetString(buffer);
                context.Request.Body = body;

                Log.Information($"Request received on: {context.Request.Path} from {context.Request.HttpContext.Connection.RemoteIpAddress}");
                Log.Verbose($"Raw Request: {bodyAsText}");

                await _next(context);
            }
            catch (Exception ex)
            {
                Log.Error(ex, "");
                context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                await context.Response.WriteAsync(ex.Message);
            }
        }
    }
}
