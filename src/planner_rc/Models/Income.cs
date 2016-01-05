using System;

namespace Api.Models
{
    public class Income : SecuredValue
    {
        public int IncomeId { get; set; }
        public ApplicationUser User { get; set; }
        public DateTime Date { get; set; }
        public ExpectedIncome ExpectedIncome { get; set; }
    }
}