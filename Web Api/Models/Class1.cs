using System;

namespace Models
{
    public class Users
    { 
        public string EmployeeName { get; set; }
        public string Password { get; set; }
        public string Email { get; set; }
        public string ProfilePicture { get; set; }
       public string PAN { get; set; }
       public string ProfileLink { get; set; }
       public string LastUpdateComment { get; set; }
        public bool IsAdmin { get; set; }
        public string Role { get; set; }


    }
}
