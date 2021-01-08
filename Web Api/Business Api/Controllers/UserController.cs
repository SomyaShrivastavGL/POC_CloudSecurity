using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Models;
using System.Net;
using System.IO;
using System.Security.Cryptography;
using System.Text;
using DBLayer.Repo.Implementation;
using Models.Data;
using DBLayer.Repo.Interfaces;
using Newtonsoft.Json;
using Microsoft.Extensions.Configuration;
namespace Business_Api.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UserController:ControllerBase
    {
        private string _configurationKey;
        private string _configurationVector;
        private IEmployeeRepo _employeeRepo;
        
        public UserController(IEmployeeRepo employeeRepo, IConfiguration configurations)
        {
            _configurationKey = configurations.GetSection("MySettings").GetSection("Key").Value;
            _configurationVector = configurations.GetSection("MySettings").GetSection("Vector").Value;
            _employeeRepo = employeeRepo;
        }

        /// <summary>
        /// Size of hash.
        /// </summary>
        private const int HashSize = 20;
        [HttpGet("GetEmployees")]
        public async  Task<ActionResult<IEnumerable<Employee>>> GetEmployees() 
        {
           var employeeDetails= await _employeeRepo.GetAll();
            return employeeDetails.ToList();
        }

        [HttpPost("GetEmployee")]
        public async Task<ActionResult<Employee>> GetEmployee(string email)
        {
            var employeeDetail = await _employeeRepo.GetEmployee(email);
            return employeeDetail;
        }

        [HttpPost("LoginEmployee")]
        public async Task<ActionResult<HttpStatusCode>> LoginEmployee(Users user)
        {
            var employeeDetail = await _employeeRepo.GetEmployee(user.Email);
            if (employeeDetail.IsActive)
            {
                var password = DecryptPassword(employeeDetail.Password);

                if (password == user.Password)
                {
                    return HttpStatusCode.OK;
                }
            }



            return HttpStatusCode.NotFound;
        }

        [HttpPost("AddEmployee")]
        public async Task<ActionResult<int>> SaveUser(Users user)
        {
            try
            {
                Employee employee = new Employee();
                employee.Name = user.EmployeeName;
                employee.Password = EncryptedPassword(user.Password);
                employee.Email = user.Email;
                employee.CreationTimeStamp = DateTime.UtcNow;
                employee.IsActive = true;
                employee.IsLocked = false;
                employee.PAN = EncryptedPassword(user.PAN); 
                employee.ProfilePicturePath = user.ProfilePicture;
                var hasAdded = await _employeeRepo.Add(employee);

                if (hasAdded > 0)
                {
                    return hasAdded;
                }
            }
            catch (Exception ex)
            {
                throw;
            }
            return 0;
        }

        [HttpPost("UpdateEmployee")]
        public async Task<ActionResult<int>> UpdateEmployee(Users user)
        {
            try
            {
                Employee employee = new Employee();
                employee.Name = user.EmployeeName;
                employee.Password = EncryptedPassword(user.Password);
                employee.Email = user.Email;
                employee.UpdateTimeStamp = DateTime.UtcNow;
                employee.PAN = EncryptedPassword(user.PAN);
                employee.ProfilePicturePath = user.ProfilePicture;
                var hasUpdated = await _employeeRepo.Update(employee);

                if (hasUpdated > 0)
                {
                    return hasUpdated;
                }
            }
            catch(Exception ex) 
            {
                throw;
            }
            return 0;
        }
        //yet to work on this
        [HttpPost("DeleteEmployee")]
        public async Task<ActionResult<IEnumerable<Users>>> DeleteEmployee(Users user)
        {
            Employee employee = new Employee();
            employee.Name = user.EmployeeName;
            employee.Email = user.Email;
            employee.UpdateTimeStamp = DateTime.UtcNow;
            employee.ProfilePicturePath = user.ProfilePicture;
            var x = await _employeeRepo.Update(employee);

            if (x > 0)
            {

            }

            return null;
        }
       
        private byte[] EncryptedPassword(string password)
        {
            using (RijndaelManaged myRijndael = new RijndaelManaged())
            {

                myRijndael.Key = Convert.FromBase64String(_configurationKey);
                myRijndael.IV = Convert.FromBase64String(_configurationVector);
                return EncryptStringToBytes(password, myRijndael.Key, myRijndael.IV);
            }
        }

        private string DecryptPassword(byte[] password)
        {
            using (RijndaelManaged myRijndael = new RijndaelManaged())
            {
                myRijndael.Key = Convert.FromBase64String(_configurationKey);
                myRijndael.IV = Convert.FromBase64String(_configurationVector);

                return DecryptStringFromBytes(password, myRijndael.Key, myRijndael.IV);
            }
        }
        static byte[] EncryptStringToBytes(string plainText, byte[] Key, byte[] IV)
        {
            // Check arguments.
            if (plainText == null || plainText.Length <= 0)
                throw new ArgumentNullException("plainText");
            if (Key == null || Key.Length <= 0)
                throw new ArgumentNullException("Key");
            if (IV == null || IV.Length <= 0)
                throw new ArgumentNullException("IV");
            byte[] encrypted;
            // Create an RijndaelManaged object
            // with the specified key and IV.
            using (RijndaelManaged rijAlg = new RijndaelManaged())
            {
                rijAlg.Key = Key;
                rijAlg.IV = IV;

                // Create an encryptor to perform the stream transform.
                ICryptoTransform encryptor = rijAlg.CreateEncryptor(rijAlg.Key, rijAlg.IV);

                // Create the streams used for encryption.
                using (MemoryStream msEncrypt = new MemoryStream())
                {
                    using (CryptoStream csEncrypt = new CryptoStream(msEncrypt, encryptor, CryptoStreamMode.Write))
                    {
                        using (StreamWriter swEncrypt = new StreamWriter(csEncrypt))
                        {

                            //Write all data to the stream.
                            swEncrypt.Write(plainText);
                        }
                        encrypted = msEncrypt.ToArray();
                    }
                }
            }

            // Return the encrypted bytes from the memory stream.
            return encrypted;
        }

        static string DecryptStringFromBytes(byte[] cipherText, byte[] Key, byte[] IV)
        {
            // Check arguments.
            if (cipherText == null || cipherText.Length <= 0)
                throw new ArgumentNullException("cipherText");
            if (Key == null || Key.Length <= 0)
                throw new ArgumentNullException("Key");
            if (IV == null || IV.Length <= 0)
                throw new ArgumentNullException("IV");

            // Declare the string used to hold
            // the decrypted text.
            string plaintext = null;

            // Create an RijndaelManaged object
            // with the specified key and IV.
            using (RijndaelManaged rijAlg = new RijndaelManaged())
            {
                rijAlg.Key = Key;
                rijAlg.IV = IV;

                // Create a decryptor to perform the stream transform.
                ICryptoTransform decryptor = rijAlg.CreateDecryptor(rijAlg.Key, rijAlg.IV);

                // Create the streams used for decryption.
                using (MemoryStream msDecrypt = new MemoryStream(cipherText))
                {
                    using (CryptoStream csDecrypt = new CryptoStream(msDecrypt, decryptor, CryptoStreamMode.Read))
                    {
                        using (StreamReader srDecrypt = new StreamReader(csDecrypt))
                        {
                            // Read the decrypted bytes from the decrypting stream
                            // and place them in a string.
                            plaintext = srDecrypt.ReadToEnd();
                        }
                    }
                }
            }

            return plaintext;
        }
    }
}
