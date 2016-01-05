using Api.Models;
using Microsoft.AspNet.Authorization;
using Microsoft.AspNet.Mvc;
using Microsoft.Data.Entity;
using System.Collections.Generic;
using System.Linq;

// For more information on enabling Web API for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace planner.Controllers
{
    [Route("api/[controller]")]
    public class ExpensesController : Controller
    {
        private ApiContext apiContext;
        //IUsersService usersService;

        public ExpensesController(ApiContext apiContext)
        {
            this.apiContext = apiContext;
            //usersService = new UsersService(db);
        }

        // GET: api/Expenses
        [Authorize]
        [HttpGet]
        public IList<Expense> GetExpenses()
        {
            string userName = User.Identity.Name;
            IQueryable<Expense> expenses = apiContext.Expenses.Include(b=>b.User).Include(b=>b.ExpectedExpense).OrderByDescending(b => b.Date);
            IList<Expense> userExpenses = new List<Expense>();
            foreach(Expense expense in expenses)
            {
                if(expense.User.UserName == userName)
                {
                    expense.decryptValue();
                    userExpenses.Add(expense);
                }
            }        
            return userExpenses;
        }

        // GET: api/Expenses/5
        [HttpGet("{id:int}")]
        public IActionResult GetExpense(int id)
        {
            Expense expense = apiContext.Expenses.Include(b => b.ExpectedExpense).FirstOrDefault(b => b.ExpenseId == id);
            if (expense == null)
            {
                return new HttpNotFoundResult();
            }
            expense.decryptValue();
            return new ObjectResult(expense);
        }

        // PUT: api/Expenses/5
        [HttpPut("{id:int}")]
        public IActionResult PutExpense(int id, [FromBody]Expense expense)
        {
            if (!ModelState.IsValid)
            {
                return HttpBadRequest(ModelState);
            }

            if (id != expense.ExpenseId)
            {
                return HttpBadRequest();
            }

            expense.encryptValue();
            expense.User = getCurrentUser();
            apiContext.Entry(expense).State = EntityState.Modified;

            try
            {

                apiContext.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ExpenseExists(id))
                {
                    return new HttpNotFoundResult();
                }
                else
                {
                    throw;
                }
            }

            return new ObjectResult(expense);
        }

        private ApplicationUser getCurrentUser()
        {
            string currentUserName = User.Identity.Name;
            return apiContext.Users.FirstOrDefault(u => u.UserName == currentUserName);
        }

        // POST: api/Expenses
        [HttpPost]
        public IActionResult PostExpense([FromBody]Expense expense)
        {
            ApplicationUser currentUser = getCurrentUser();

            if (!ModelState.IsValid)
            {
                return HttpBadRequest(ModelState);
            }
            
            ExpectedExpense expectedExpense = apiContext.ExpectedExpenses.Where(b => b.ExpectedExpenseId == expense.ExpectedExpense.ExpectedExpenseId).FirstOrDefault();
            if (expectedExpense.User.UserName != currentUser.UserName)
            {
                return HttpBadRequest();
            }
            expense.encryptValue();
            expense.User = currentUser;
            expense.ExpectedExpense = expectedExpense;

            apiContext.Expenses.Add(expense);
            apiContext.SaveChanges();

            expense.decryptValue();
            return new ObjectResult(expense);
        }

        // DELETE: api/Expenses/5
        [HttpDelete("{id:int}")]
        public IActionResult DeleteExpense(int id)
        {
            Expense expense = apiContext.Expenses.FirstOrDefault(e => e.ExpenseId == id);
            if (expense == null)
            {
                return HttpNotFound();
            }

            apiContext.Expenses.Remove(expense);
            apiContext.SaveChanges();

            return new ObjectResult(expense);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                apiContext.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool ExpenseExists(int id)
        {
            return apiContext.Expenses.Count(e => e.ExpenseId == id) > 0;
        }
    }
}
