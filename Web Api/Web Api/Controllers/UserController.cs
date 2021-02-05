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
using Models.Data;
using System.Text;

namespace Web_Api.Controllers
{
    //[Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UserController:ControllerBase
    {
        private string businessurl = "https://localhost:44394/api/User/";

        [HttpPost("Login")]
        public HttpResponseMessage LoginEmployee(Users user)
        {
            var jsonString = Newtonsoft.Json.JsonConvert.SerializeObject(user);           
            return CheckUser(user);
        }

        public HttpResponseMessage CheckUser(Users user)
        {
            HttpClient client = new HttpClient();
            client.DefaultRequestHeaders.Accept.Clear();
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", "aGFyam90LnNpbmdoQGdtYWlsLmNvbToxMjM0NTY3ODkw");
            return client.PostAsJsonAsync(businessurl + "LoginEmployee", user).Result;
        }

        [HttpGet("GetEmployee")]
        public Users GetEmployee(string email) 
        {
            HttpWebRequest webRequest = (HttpWebRequest)WebRequest.Create(string.Format(businessurl + "GetEmployeeInfo?email={0}", email));
            webRequest.ContentType = "application/x-www-form-urlencoded";
            webRequest.Headers.Add("Authorization", "Basic aGFyam90LnNpbmdoQGdtYWlsLmNvbToxMjM0NTY3ODkw");
            webRequest.Method = WebRequestMethods.Http.Post;
            webRequest.AllowAutoRedirect = true;
            webRequest.Proxy = null;
            string data = "email="+email;
            byte[] dataStream = Encoding.UTF8.GetBytes(data);
            webRequest.ContentLength = dataStream.Length;
            Stream newStream = webRequest.GetRequestStream();
            newStream.Write(dataStream, 0, dataStream.Length);
            newStream.Close();

            HttpWebResponse responses = (HttpWebResponse)webRequest.GetResponse();
            Stream stream = responses.GetResponseStream();
            StreamReader streamreader = new StreamReader(stream);
            string returnResult = streamreader.ReadToEnd();

            var returnItems = Newtonsoft.Json.JsonConvert.DeserializeObject<Users>(returnResult);
            return returnItems;
        }

        
        [HttpGet("GetEmployees")]
        public IEnumerable<Employee> GetEmployees()
        {
            WebRequest obj = WebRequest.Create(businessurl + "GetEmployeesInfo");
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
          var returnItems=  Newtonsoft.Json.JsonConvert.DeserializeObject<IEnumerable<Employee>>(result);
            return returnItems;
        }
        [HttpPost("AddEmployee")]
        public HttpResponseMessage SaveUser(Users user)
        {
            var jsonString = Newtonsoft.Json.JsonConvert.SerializeObject(user);

            HttpClient client = new HttpClient();
            client.DefaultRequestHeaders.Accept.Clear();
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            client.DefaultRequestHeaders.Authorization=new AuthenticationHeaderValue("Basic", "aGFyam90LnNpbmdoQGdtYWlsLmNvbToxMjM0NTY3ODkw");
            HttpResponseMessage response = client.PostAsJsonAsync(businessurl + "AddEmployees", user).Result;
            return response;
        }
        [HttpPost("UpdateEmployee")]
        public HttpResponseMessage UpdateUser(Users user)
        {
            HttpClient client = new HttpClient();
            client.DefaultRequestHeaders.Accept.Clear();
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", "aGFyam90LnNpbmdoQGdtYWlsLmNvbToxMjM0NTY3ODkw");
            HttpResponseMessage response = client.PostAsJsonAsync(businessurl + "UpdateEmployees", user).Result;
            return response;
        }
    }
}
