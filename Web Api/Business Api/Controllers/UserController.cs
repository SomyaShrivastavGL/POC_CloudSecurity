using DBLayer.Repo.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Models;
using Models.Data;
using Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace Business_Api.Controllers
{
    //[Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private IEncryption _encryptionService;
        private IEmployeeRepo _employeeRepo;

        public UserController(IEmployeeRepo employeeRepo, IEncryption encryptionService)
        {
            _employeeRepo = employeeRepo;
            _encryptionService = encryptionService;
        }


        /// <summary>
        /// Size of hash.
        /// </summary>
        private const int HashSize = 20;
        [HttpGet("GetEmployeesInfo")]
        public async Task<ActionResult<IEnumerable<Employee>>> GetEmployees()
        {
            var employeeDetails = await _employeeRepo.GetAll();
            return employeeDetails.ToList();
        }

        [HttpPost("GetEmployeeInfo")]
        public async Task<ActionResult<Users>> GetEmployee(string email)
        {
            var employeeDetail = await _employeeRepo.GetEmployee(email);

            Users user = new Users();

            user.Email = employeeDetail.Email;
            user.EmployeeName = employeeDetail.Name;
            user.PAN = _encryptionService.Decrypt(employeeDetail.PAN);
            user.Password = _encryptionService.Decrypt(employeeDetail.Password);
            user.ProfilePicture = employeeDetail.ProfilePicturePath;
            user.LastUpdateComment = employeeDetail.LastUpdateComment;
            user.ProfileLink = employeeDetail.ProfileLink;
            user.IsAdmin = employeeDetail.IsAdmin;
            user.Role = employeeDetail.Role;

            return user;
        }

        [HttpPost("DeleteEmployeeInfo")]
        public async Task<ActionResult<int>> DeleteEmployee(string email)
        {
            Employee employee = new Employee();
            employee.Email = email;
            return await _employeeRepo.Delete(employee);
        }

        [HttpPost("LoginEmployee")]
        public async Task<ActionResult<HttpStatusCode>> LoginEmployee(Users user)
        {
            var employeeDetail = await _employeeRepo.GetEmployee(user.Email);
            if (employeeDetail != null && employeeDetail.IsActive)
            {
                var password = _encryptionService.Decrypt(employeeDetail.Password);

                if (password == user.Password)
                {
                    return HttpStatusCode.OK;
                }
            }

            return HttpStatusCode.NotFound;
        }

        [HttpPost("AddEmployees")]
        public async Task<ActionResult<int>> SaveUsers(Users user)
        {
            try
            {
                Employee employee = new Employee();
                employee.Name = user.EmployeeName;
                employee.Password = _encryptionService.Encrypt(user.Password);
                employee.Email = user.Email;
                employee.CreationTimeStamp = DateTime.UtcNow;
                employee.IsActive = true;
                employee.IsLocked = false;
                employee.IsAdmin = user.IsAdmin;
                if (user.IsAdmin)
                {
                    employee.Role = "18";
                }
                else
                    employee.Role = "15";

                employee.PAN = _encryptionService.Encrypt(user.PAN);
                employee.ProfilePicturePath = user.ProfilePicture;
                employee.LastUpdateComment = user.LastUpdateComment;
                employee.ProfileLink = user.ProfileLink;
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

        [HttpPost("UpdateEmployees")]
        public async Task<ActionResult<int>> UpdateEmployee(Users user)
        {
            try
            {
                var employeeDetail = await _employeeRepo.GetEmployee(user.Email);
                Employee employee = new Employee();
                employeeDetail.Name = user.EmployeeName;
                employeeDetail.Password = _encryptionService.Encrypt(user.Password);
                employeeDetail.Email = user.Email;
                employeeDetail.UpdateTimeStamp = DateTime.UtcNow;
                employeeDetail.PAN = _encryptionService.Encrypt(user.PAN);
                if (IsValidImage(user.ProfilePicture))
                {
                    employeeDetail.ProfilePicturePath = user.ProfilePicture;
                }
                else
                {
                    throw new ArgumentException("Profile Picture submitted is not valid.");
                }

                employeeDetail.ProfileLink = user.ProfileLink;
                employeeDetail.LastUpdateComment = user.LastUpdateComment;
                var hasUpdated = await _employeeRepo.Update(employeeDetail);

                if (hasUpdated > 0)
                {
                    return hasUpdated;
                }
            }
            catch (Exception ex)
            {
                throw;
            }
            return 0;
        }
        private bool IsValidImage(string img)
        {
            try
            {
                byte[] bytes = Convert.FromBase64String(img.Split(',')[1]);

                System.Drawing.Image image;
                using (MemoryStream ms = new MemoryStream(bytes))
                {
                    image = Image.FromStream(ms);
                }

                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
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

    }
}
