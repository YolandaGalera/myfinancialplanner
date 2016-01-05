using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.Data.Entity;
using System;

namespace Api.Models
{
    public class ApplicationUser : IdentityUser {
        public string Country { get; set; }
        public string Birthday { get; set; }
    }

    public class ApiContext : IdentityDbContext<ApplicationUser>
    {
        // You can add custom code to this file. Changes will not be overwritten.
        // 
        // If you want Entity Framework to drop and regenerate your database
        // automatically whenever you change your model schema, please use data migrations.
        // For more information refer to the documentation:
        // http://msdn.microsoft.com/en-us/data/jj591621.aspx

        public DbSet<Expense> Expenses { get; set; }

        public DbSet<Income> Incomes { get; set; }

        public DbSet<ExpectedExpense> ExpectedExpenses { get; set; }

        public DbSet<ExpectedIncome> ExpectedIncomes { get; set; }

    }
}
