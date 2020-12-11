using Models.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace DBLayer.Repo.Interfaces
{
    interface IEmployeeRepo
    {
        Task<int> Add(Employee employee);
        Task<int> Update(Employee employee);
        Task<int> Delete(Employee employee);
        Task<IEnumerable<Employee>> GetAll();
        Task<IEnumerable<Employee>> Filter(Expression<Func<Employee, bool>> filter);
        Task<Employee> GetEmployee(int Id);
    }
}
