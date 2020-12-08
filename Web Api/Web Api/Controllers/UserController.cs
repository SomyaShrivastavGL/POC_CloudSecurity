using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Models;
using System.Net;
using System.IO;
using System.Net.Http;
using System.Net.Http.Headers;

namespace Web_Api.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UserController:ControllerBase
    {
        [HttpPost("GetEmployee")]
        public  Task<ActionResult<IEnumerable<Users>>> GetEmployee(string email) 
        {
            string businessurl = string.Format("https://localhost:44394/api/User/GetEmployee?email={0}" , email);
            HttpClient client = new HttpClient();
            client.DefaultRequestHeaders.Accept.Clear();
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", "aGFyam90LnNpbmdoQGdtYWlsLmNvbToxMjM0NTY3ODkw");
            HttpResponseMessage response = client.PostAsJsonAsync(businessurl, email).Result;
            return null;
        }

        [HttpGet("GetEmployees")]
        public Task<ActionResult<IEnumerable<Users>>> GetEmployees()
        {
            string businessurl = string.Format("https://localhost:44394/api/User/GetEmployees");
            WebRequest obj = WebRequest.Create(businessurl);
            obj.Method = "Post";
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
        [HttpPost("AddEmployee")]
        public Task<ActionResult<IEnumerable<Users>>> SaveUser(Users user)
        {
            string businessurl = string.Format("https://localhost:44394/api/User/AddEmployee");
            
            var jsonString = Newtonsoft.Json.JsonConvert.SerializeObject(user);

            HttpClient client = new HttpClient();
            client.DefaultRequestHeaders.Accept.Clear();
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            client.DefaultRequestHeaders.Authorization=new AuthenticationHeaderValue("Basic", "aGFyam90LnNpbmdoQGdtYWlsLmNvbToxMjM0NTY3ODkw");
            HttpResponseMessage response = client.PostAsJsonAsync(businessurl, user).Result;
            return null;
        }
        [HttpPost("UpdateEmployee")]
        public Task<ActionResult<IEnumerable<Users>>> UpdateUser(Users user)
        {
            string businessurl = string.Format("https://localhost:44394/api/User/UpdateEmployee");
            HttpClient client = new HttpClient();
            client.DefaultRequestHeaders.Accept.Clear();
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", "aGFyam90LnNpbmdoQGdtYWlsLmNvbToxMjM0NTY3ODkw");
            HttpResponseMessage response = client.PostAsJsonAsync(businessurl, user).Result;
            return null;
        }
    }
}
