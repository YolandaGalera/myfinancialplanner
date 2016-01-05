using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace planner.Models
{
    public class ExpenseViewModel
    {
        public int ExpectedExpenseId { get; set; }
        public DateTime Date { get; set; }
        public float value { get; set; }
    }
}
