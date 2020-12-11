using System;
using System.Collections.Generic;

namespace Models.Data
{
    public class Employee
    {
        public int ID { get; set; }
        public string Name { get; set; }
        public byte[] PAN { get; set; }
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
