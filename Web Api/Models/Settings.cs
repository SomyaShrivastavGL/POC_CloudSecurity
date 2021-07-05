namespace Models
{
    public class EncryptionSettings
    {
        public string Key { get; set; }
        public string Vector { get; set; }
    }

    public class ConnectionStrings
    {
        public string EmployeeDBConnection { get; set; }
    }
}
