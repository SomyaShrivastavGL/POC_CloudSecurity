using System;
using System.Collections.Generic;
using System.Text;

namespace Models
{
    /*
     * UNSECURE DESRIALIZATION
     * This vulnerability refers to the safety concerns around deserializing user input from untrusted sources.
     * The most common source is deserializing a user input JSON into a dynamic or weakly typed object.
     * Or letting the $type variable in JSON schema dictate the final type object will be deserialized into. 
     * The best ways to protect yourself from these attacks:
     * 1. Always deserialize JSON or any serialized input into a strongly typed object.
     * 2. If you are using a 3rd party deserializer like JSON.net or similar, disable automatic type handling.
     * In Newtonsoft.JSON package, you can disable this at a global level by setting Typenamehandling to none. 
     * Check documentation for the 3rd party deserializer you are using.
     * In the default first party deserializer provided by .NET CORE 3.0+ , System.Text.JSON, there is no support for automatic type handling.
     * This was done to safe guard from this specific vulnerability.
     * It is recommended to use this desrializer over any 3rd party ones.
     */
}
