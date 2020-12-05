using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Models;
using System.Net;
using System.IO;

namespace Web_Api.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UserController:ControllerBase
    {
        [HttpGet("GetUsers")]
        public  Task<ActionResult<IEnumerable<Users>>> GetUsers() 
        {
            string businessurl = string.Format("https://localhost:44394/api/User/GetUsers");
            WebRequest obj = WebRequest.Create(businessurl);
            obj.Method = "Get";
            HttpWebResponse respo = null;
            obj.Headers.Add("Authorization", "Basic aGFyam90LnNpbmdoQGdtYWlsLmNvbToxMjM0NTY3ODkw");
            respo = (HttpWebResponse)obj.GetResponse();
            string result = null;
            using (Stream stream = respo.GetResponseStream())
            {
                StreamReader sr = new StreamReader(stream);
                result = sr.ReadToEnd();
                sr.Close();
            }


            return null;
        }

        [HttpPost("SaveUser")]
        public Task<ActionResult<IEnumerable<Users>>> SaveUser()
        {
            string businessurl = string.Format("https://localhost:44394/api/User/SaveUser");
            WebRequest obj = WebRequest.Create(businessurl);
            obj.Method = "Get";
            HttpWebResponse respo = null;
            obj.Headers.Add("Authorization", "Basic aGFyam90LnNpbmdoQGdtYWlsLmNvbToxMjM0NTY3ODkw");
            respo = (HttpWebResponse)obj.GetResponse();
            string result = null;
            using (Stream stream = respo.GetResponseStream())
            {
                StreamReader sr = new StreamReader(stream);
                result = sr.ReadToEnd();
                sr.Close();
            }


            return null;
        }
    }
}
