using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Models.Data;
using Services.Interfaces;
using System;

namespace DBLayer
{
    public class EmployeeDBContext : DbContext
    {
        IEncryption _encryption;
        IConfiguration _configuration;
        public EmployeeDBContext(IEncryption encryption, IConfiguration configuration)
        {
            _encryption = encryption;
            _configuration = configuration;
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer(
                _encryption.Decrypt(Convert.FromBase64String(_configuration.GetConnectionString("EmployeeDBConnection"))),
                b => b.MigrationsAssembly("Business Api"));
        }

        public DbSet<Employee> Employees { get; set; }
        public DbSet<EmployeeResume> EmployeeResumes { get; set; }
        public DbSet<Roles> Roles { get; set; }
        public DbSet<UserRoles> UserRoles { get; set; }
    }
}
