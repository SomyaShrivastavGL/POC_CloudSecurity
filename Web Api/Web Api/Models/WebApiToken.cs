using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Web_Api.Infrastructure;

namespace Web_Api.Models
{
    public class WebApiToken
    {
        public JWTToken accessToken { get; set; }
        public string refreshToken { get; set; }

        public string expiredToken { get; set; }
    }
}
