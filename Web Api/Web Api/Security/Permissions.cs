using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Web_Api.Security
{
    public  class Permissions
    {
        public static Dictionary<string, string> adminpermissionDictionary { get; set; }
        public static Dictionary<string, string> userpermissionDictionary { get; set; }
        public static Dictionary<string, string> userDictionary { get; set; }

        public static string GetAdminPermission(string routeValue)
        {
            adminpermissionDictionary = new Dictionary<string, string>()
        {
            {"GetEmployee","0"},{"GetEmployees","17167810511"},{"UpdateEmployee","0"},{"AddEmployee","0"},{"DeleteEmployee","17167810511"}
        };
        string value;
            adminpermissionDictionary.TryGetValue(routeValue, out value);
            return value;

        }

        public static string GetUserPermission(string routeValue)
        {
            userpermissionDictionary = new Dictionary<string, string>()
        {
            {"GetEmployee","4095"},{"GetEmployees","4095"},{"UpdateEmployee","4095"},{"AddEmployee","4095"},{"DeleteEmployee","0"}
        };
        string value;
            userpermissionDictionary.TryGetValue(routeValue, out value);
            return value;

        }

        public static string GetEmployeeDirectory(string type)
        {
            userDictionary = new Dictionary<string, string>()
        {
            {"Admin","5000"},{"User","1024"}
        };
            string value;
            userDictionary.TryGetValue(type, out value);
            return value;

        }
    }
}
