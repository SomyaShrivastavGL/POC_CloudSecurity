using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Web_Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AntiForgeryController : ControllerBase
    {
        private IAntiforgery _antiForgery;
        
        //Inject AntiForgeryService
        public AntiForgeryController(IAntiforgery antiforgery)
        {
            _antiForgery = antiforgery;
        }
        [HttpGet("VerifyToken")]
        public IActionResult Get()
        {
            var tokenStore = _antiForgery.GetAndStoreTokens(HttpContext);
            Response.Cookies.Append("XSRF-REQUEST", tokenStore.CookieToken, new CookieOptions() { HttpOnly = false });
            return Ok();
        }
    }
}
