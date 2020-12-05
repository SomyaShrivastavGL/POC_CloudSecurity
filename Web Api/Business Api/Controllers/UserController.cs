using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Models;
using System.Net;
using System.IO;

namespace Business_Api.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UserController:ControllerBase
    {
        [HttpGet("GetUsers")]
        public  Task<ActionResult<IEnumerable<Users>>> GetUsers() 
        {
            return null;
        }

        [HttpPost("SaveUser")]
        public Task<ActionResult<IEnumerable<Users>>> SaveUser()
        {
            return null;
        }
    }
}
