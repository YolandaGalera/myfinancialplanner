
namespace Api.Models
{
    public class ExpectedExpense : SecuredValue
    {
        public int ExpectedExpenseId { get; set; }
        public ApplicationUser User { get; set; }
        public string Name { get; set; }
        public bool Deleted { get; set; }
    }
}