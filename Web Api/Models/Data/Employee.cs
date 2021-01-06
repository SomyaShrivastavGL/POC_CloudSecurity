using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Models.Data
{
    public class Employee
    {
        public string Name { get; set; }
        public byte[] PAN { get; set; }
        public Boolean IsAdmin { get; set; }
        [Key]
        public string Email { get; set; }
        public byte[] Password { get; set; }
        public string ProfilePicturePath { get; set; }
        public bool IsLocked { get; set; }
        public bool IsActive { get; set; }
        public DateTime LastLogin { get; set; }
        public DateTime CreationTimeStamp { get; set; }
        public DateTime UpdateTimeStamp { get; set; }
        ICollection<EmployeeResume> Resumes { get; set; }
    }
}
