using System;
using System.Collections.Generic;
using System.Text;

namespace Models.Data
{
    public class EmployeeResume
    {
        public int Id { get; set; }
        public string ResumeFilePath { get; set; }
        public bool IsDeleted { get; set; }
        public DateTime CreationTimeStamp { get; set; }
        public int EmployeeId { get; set; }
        public Employee Employee { get; set; }
    }
}
