
namespace Api.Models
{
    public class ExpectedIncome : SecuredValue
    {
        public int ExpectedIncomeId { get; set; }
        public ApplicationUser User { get; set; }
        public string Name { get; set; }
        public bool Deleted { get; set; }
    }
}