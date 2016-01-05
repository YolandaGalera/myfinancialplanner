using Api.Models;
using Microsoft.AspNet.Authorization;
using Microsoft.AspNet.Mvc;
using Microsoft.Data.Entity;
using Microsoft.Data.Entity.Update;
using System.Collections.Generic;
using System.Linq;

namespace Api.Controllers
{
    [Route("api/[controller]")]
    public class ExpectedExpensesController : Controller
    {
        private ApiContext apiContext;

        public ExpectedExpensesController(ApiContext apiContext)
        {
            this.apiContext = apiContext;
        }

        [Authorize]
        // GET: api/ExpectedExpenses
        [HttpGet]
        public IList<ExpectedExpense> GetExpectedExpenses()
        {
            string currentUserName = User.Identity.Name;
            IQueryable<ExpectedExpense> expectedExpenses = apiContext.ExpectedExpenses.Where(b=> b.Deleted == false).Include(b => b.User);
            IList<ExpectedExpense> expectedExpensesResult = new List<ExpectedExpense>();

            foreach (ExpectedExpense expectedExpense in expectedExpenses)
            {
                if (expectedExpense.User.UserName == currentUserName)
                {
                    expectedExpense.decryptValue();
                    expectedExpensesResult.Add(expectedExpense);
                }
            }

            return expectedExpensesResult;
        }

        [Authorize]
        [HttpGet("{id:int}")]
        // GET: api/ExpectedExpenses/5
        public IActionResult GetExpectedExpense(int id)
        {
            ExpectedExpense expectedExpense = apiContext.ExpectedExpenses.FirstOrDefault(e => e.ExpectedExpenseId == id);
            if (expectedExpense == null)
            {
                return HttpNotFound();
            }
            expectedExpense.decryptValue();
            return new ObjectResult(expectedExpense);
        }

        [Authorize]
        // PUT: api/ExpectedExpenses/5
        [HttpPut("{id:int}")]
        public IActionResult PutExpectedExpense(int id, [FromBody]ExpectedExpense expectedExpense)
        {
            if (!ModelState.IsValid)
            {
                return HttpBadRequest(ModelState);
            }

            if (id != expectedExpense.ExpectedExpenseId)
            {
                return HttpBadRequest();
            }
            expectedExpense.encryptValue();
            expectedExpense.User = getCurrentUser();
            apiContext.Entry(expectedExpense).State = EntityState.Modified;

            try
            {
                apiContext.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ExpectedExpenseExists(id))
                {
                    return HttpNotFound();
                }
                else
                {
                    throw;
                }
            }

            return new NoContentResult();
        }

        [Authorize]
        // POST: api/ExpectedExpenses
        [HttpPost]
        public IActionResult PostExpectedExpense([FromBody]ExpectedExpense expectedExpense)
        {
            ApplicationUser currentUser = getCurrentUser();
            expectedExpense.User = currentUser;

            if (!ModelState.IsValid)
            {
                return HttpBadRequest(ModelState);
            }

            if (expectedExpense.ExpectedExpenseId != 0)
            {
                expectedExpense.encryptValue();
                UpdateExpectedExpense(expectedExpense);
                expectedExpense.decryptValue();
                return new ObjectResult(expectedExpense);
            }

            IQueryable<ExpectedExpense> allExpectedExpenses = apiContext.ExpectedExpenses.Include(b => b.User);
            ExpectedExpense expectedExpenseDb = null;
            foreach (ExpectedExpense expectedExpenseItem in allExpectedExpenses)
            {
                if (expectedExpenseItem.User.Id == expectedExpense.User.Id && expectedExpenseItem.Name == expectedExpense.Name && expectedExpense.ExpectedExpenseId == 0 && expectedExpenseItem != null)
                {
                    expectedExpenseDb = expectedExpenseItem;
                }
            }

            if(expectedExpenseDb != null)
            {
                return updateExpense(expectedExpenseDb, expectedExpense);
            }

            expectedExpense.encryptValue();
            apiContext.ExpectedExpenses.Add(expectedExpense);
            apiContext.SaveChanges();
            expectedExpense.decryptValue();
            return new ObjectResult(expectedExpense);
        }

        private ApplicationUser getCurrentUser()
        {
            string currentUserName = User.Identity.Name;
            return apiContext.Users.FirstOrDefault(u => u.UserName == currentUserName);
        }

        private IActionResult updateExpense(ExpectedExpense expectedExpenseItem, ExpectedExpense expectedExpense)
        {
            ApplicationUser currentUser = getCurrentUser();
            if (expectedExpenseItem.User.UserName != currentUser.UserName)
            {
                return HttpBadRequest();
            }
            expectedExpenseItem.Value = expectedExpense.Value;
            expectedExpenseItem.EncryptedValue = expectedExpense.EncryptedValue;
            expectedExpenseItem.Deleted = expectedExpense.Deleted;
            expectedExpenseItem.encryptValue();
            UpdateExpectedExpense(expectedExpenseItem);
            expectedExpenseItem.decryptValue();
            return new ObjectResult(expectedExpenseItem);
        }

        private void UpdateExpectedExpense(ExpectedExpense expectedExpense)
        {
            apiContext.Entry(expectedExpense).State = EntityState.Modified;
            apiContext.SaveChanges();
        }

        private bool ExpectedExpenseExists(int id)
        {
            return apiContext.ExpectedExpenses.Count(e => e.ExpectedExpenseId == id) > 0;
        }
    }
}