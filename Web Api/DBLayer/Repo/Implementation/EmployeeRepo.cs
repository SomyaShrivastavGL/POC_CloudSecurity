using DBLayer.Repo.Interfaces;
using Microsoft.EntityFrameworkCore;
using Models.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace DBLayer.Repo.Implementation
{
    public class EmployeeRepo : IEmployeeRepo
    {
        private EmployeeDBContext _ctx;
        public EmployeeRepo(EmployeeDBContext ctx)
        {
            _ctx = ctx;
        }
        public async Task<int> Add(Employee employee)
        {
            _ctx.Employees.Add(employee);
            return await _ctx.SaveChangesAsync();
        }

        public async Task<int> Delete(Employee employee)
        {
            _ctx.Employees.Remove(employee);
            return await _ctx.SaveChangesAsync();
        }

        public async Task<IEnumerable<Employee>> Filter(Expression<Func<Employee, bool>> filter)
        {
            return await _ctx.Employees.Where(filter).ToListAsync();
        }

        public async Task<IEnumerable<Employee>> GetAll()
        {
            return await _ctx.Employees.ToListAsync();
        }

        public async Task<Employee> GetEmployee(string Email)
        {
            return await _ctx.Employees.FindAsync(Email);
        }

        public async Task<int> Update(Employee employee)
        {
            _ctx.Entry(employee).State = EntityState.Modified;
            return await _ctx.SaveChangesAsync();
        }
    }
}
