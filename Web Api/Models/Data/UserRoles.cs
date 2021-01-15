using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Models.Data
{
    public class UserRoles
    {
        [Key]
        public int ID { get; set; }
        public string Email { get; set; }
        public int RolesID { get; set; }
    }
}
