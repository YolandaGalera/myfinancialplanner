using System;

namespace Api.Models
{
    public class Expense : SecuredValue
    {
        public int ExpenseId { get; set; }
        public ApplicationUser User { get; set; }
        public DateTime Date { get; set; }
        public ExpectedExpense ExpectedExpense { get; set; }
    }
}