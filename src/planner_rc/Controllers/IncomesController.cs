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
    public class IncomesController : Controller
    {
        private ApiContext apiContext;
        //IUsersService usersService;

        public IncomesController(ApiContext apiContext)
        {
            this.apiContext = apiContext;
            //usersService = new UsersService(db);
        }

        // GET: api/Incomes
        [Authorize]
        [HttpGet]
        public IList<Income> GetIncomes()
        {
            string userName = User.Identity.Name;
            IQueryable<Income> incomes = apiContext.Incomes.Include(b => b.User).Include(b => b.ExpectedIncome).OrderByDescending(b => b.Date);
            IList<Income> userIncomes = new List<Income>();
            foreach (Income income in incomes)
            {
                if (income.User.UserName == userName)
                {
                    income.decryptValue();
                    userIncomes.Add(income);
                }
            }
            return userIncomes;
        }

        // GET: api/Incomes/5
        [HttpGet("{id:int}")]
        public IActionResult GetIncome(int id)
        {
            Income income = apiContext.Incomes.FirstOrDefault(b => b.IncomeId == id);
            if (income == null)
            {
                return new HttpNotFoundResult();
            }
            income.decryptValue();
            return new ObjectResult(income);
        }

        // PUT: api/Incomes/5
        [HttpPut("{id:int}")]
        public IActionResult PutIncome(int id, [FromBody]Income income)
        {
            if (!ModelState.IsValid)
            {
                return HttpBadRequest(ModelState);
            }

            if (id != income.IncomeId)
            {
                return HttpBadRequest();
            }
            income.encryptValue();
            income.User = getCurrentUser();
            apiContext.Entry(income).State = EntityState.Modified;

            try
            {
                apiContext.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!IncomeExists(id))
                {
                    return new HttpNotFoundResult();
                }
                else
                {
                    throw;
                }
            }
            income.decryptValue();
            return new ObjectResult(income);
        }

        private ApplicationUser getCurrentUser()
        {
            string currentUserName = User.Identity.Name;
            return apiContext.Users.FirstOrDefault(u => u.UserName == currentUserName);
        }

        // POST: api/Incomes
        [HttpPost]
        public IActionResult PostIncome([FromBody]Income income)
        {
            ApplicationUser currentUser = getCurrentUser();

            if (!ModelState.IsValid)
            {
                return HttpBadRequest(ModelState);
            }

            ExpectedIncome expectedIncome = apiContext.ExpectedIncomes.Where(b => b.ExpectedIncomeId == income.ExpectedIncome.ExpectedIncomeId).FirstOrDefault();
            if (expectedIncome.User.UserName != currentUser.UserName)
            {
                return HttpBadRequest();
            }
            income.ExpectedIncome = expectedIncome;
            income.User = currentUser;
            income.encryptValue();

            apiContext.Incomes.Add(income);
            apiContext.SaveChanges();

            income.decryptValue();
            return new ObjectResult(income);
        }

        // DELETE: api/Incomes/5
        [HttpDelete("{id:int}")]
        public IActionResult DeleteIncome(int id)
        {
            Income income = apiContext.Incomes.FirstOrDefault(e => e.IncomeId == id);
            if (income == null)
            {
                return HttpNotFound();
            }

            apiContext.Incomes.Remove(income);
            apiContext.SaveChanges();

            return new ObjectResult(income);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                apiContext.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool IncomeExists(int id)
        {
            return apiContext.Incomes.Count(e => e.IncomeId == id) > 0;
        }
    }
}
