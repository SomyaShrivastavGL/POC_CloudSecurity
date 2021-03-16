using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Web_Api.Security
{
    public class Permissions
    {
        public static Dictionary<string, string> permissionDictionary { get; set; }

      
        public static string GetPermission(string routeValue)
        {
            permissionDictionary = new Dictionary<string, string>()
        {
            {"GetEmployee","1"},{"GetEmployees","2"},{"UpdateEmployee","4"},{"AddEmployee","8"},{"DeleteEmployee","16"}
        };
            string value;
            permissionDictionary.TryGetValue(routeValue, out value);
            return value;
        }
    }
}
