using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Models.Data
{
    public class Roles
    {
        [Key]
        public int ID { get; set; }
        public string Name { get; set; }
        public string NormalizedName { get; set; }
        public string ConcurrencyStamp { get; set; } = Guid.NewGuid().ToString();
    }
}
