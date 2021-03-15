using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Web_Api.Models
{
    public class Bitwise
    {
        public static bool IsAttributeInCombination(long AttributeValue, long CombinationValue)
        {
            return ((AttributeValue & CombinationValue) == AttributeValue);
        }
    }
}
