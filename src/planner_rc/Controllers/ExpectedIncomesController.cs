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
    public class ExpectedIncomesController : Controller
    {
        private ApiContext apiContext;
        //IUsersService usersService;

        public ExpectedIncomesController(ApiContext apiContext)
        {
            this.apiContext = apiContext;
            //usersService = new UsersService(db);
        }

        [Authorize]
        // GET: api/ExpectedIncomes
        [HttpGet]
        public IList<ExpectedIncome> GetExpectedIncomes()
        {
            string currentUserName = User.Identity.Name;
            IQueryable<ExpectedIncome> expectedIncomes = apiContext.ExpectedIncomes.Where(b => b.Deleted == false).Include(b => b.User);
            IList<ExpectedIncome> expectedIncomesResult = new List<ExpectedIncome>();

            foreach (ExpectedIncome expectedIncome in expectedIncomes)
            {
                if (expectedIncome.User.UserName == currentUserName)
                {
                    expectedIncome.decryptValue();
                    expectedIncomesResult.Add(expectedIncome);
                }
            }

            return expectedIncomesResult;
        }

        private ApplicationUser getCurrentUser()
        {
            string currentUserName = User.Identity.Name;
            return apiContext.Users.FirstOrDefault(u => u.UserName == currentUserName);
        }

        private IActionResult findExpectedIncomeToUpdate(ExpectedIncome expectedIncomeItem, ExpectedIncome expectedIncome)
        {
            ApplicationUser currentUser = getCurrentUser();
            if (expectedIncomeItem.User.UserName != currentUser.UserName)
            {
                return HttpBadRequest();
            }
            expectedIncomeItem.Value = expectedIncome.Value;
            expectedIncomeItem.EncryptedValue = expectedIncome.EncryptedValue;
            expectedIncomeItem.Deleted = expectedIncome.Deleted;
            expectedIncomeItem.encryptValue();
            UpdateExpectedIncome(expectedIncomeItem);
            expectedIncomeItem.decryptValue();
            return new ObjectResult(expectedIncomeItem);
        }

        [Authorize]
        [HttpGet("{id:int}")]
        // GET: api/ExpectedIncomes/5
        public IActionResult GetExpectedIncomes(int id)
        {
            ExpectedIncome expectedIncome = apiContext.ExpectedIncomes.FirstOrDefault(e => e.ExpectedIncomeId == id);
            if (expectedIncome == null)
            {
                return HttpNotFound();
            }
            expectedIncome.decryptValue();
            return new ObjectResult(expectedIncome);
        }

        [Authorize]
        // PUT: api/ExpectedIncome/5
        [HttpPut("{id:int}")]
        public IActionResult PutExpectedIncome(int id, [FromBody]ExpectedIncome expectedIncome)
        {
            if (!ModelState.IsValid)
            {
                return HttpBadRequest(ModelState);
            }

            if (id != expectedIncome.ExpectedIncomeId)
            {
                return HttpBadRequest();
            }
            expectedIncome.encryptValue();
            expectedIncome.User = getCurrentUser();
            apiContext.Entry(expectedIncome).State = EntityState.Modified;

            try
            {
                apiContext.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ExpectedIncomeExists(id))
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
        // POST: api/ExpectedIncomes
        [HttpPost]
        public IActionResult PostExpectedIncome([FromBody]ExpectedIncome expectedIncome)
        {
            ApplicationUser currentUser = getCurrentUser();
            expectedIncome.User = currentUser;

            if (!ModelState.IsValid)
            {
                return HttpBadRequest(ModelState);
            }

            if (expectedIncome.ExpectedIncomeId != 0)
            {
                expectedIncome.encryptValue();
                UpdateExpectedIncome(expectedIncome);
                expectedIncome.decryptValue();
                return new ObjectResult(expectedIncome);
            }

            IQueryable<ExpectedIncome> allExpectedIncomes = apiContext.ExpectedIncomes.Include(b => b.User);
            foreach (ExpectedIncome expectedIncomeItem in allExpectedIncomes) {                
                if (expectedIncomeItem.User.Id == expectedIncome.User.Id && expectedIncomeItem.Name == expectedIncome.Name && expectedIncome.ExpectedIncomeId == 0 && expectedIncomeItem != null)
                {
                  return findExpectedIncomeToUpdate(expectedIncomeItem, expectedIncome);
                }
            }

            expectedIncome.encryptValue();
            apiContext.ExpectedIncomes.Add(expectedIncome);
            apiContext.SaveChanges();
            expectedIncome.decryptValue();
            return new ObjectResult(expectedIncome);
        }

        private void UpdateExpectedIncome(ExpectedIncome expectedIncome)
        {
            apiContext.Entry(expectedIncome).State = EntityState.Modified;
            apiContext.SaveChanges();
        }

        private bool ExpectedIncomeExists(int id)
        {
            return apiContext.ExpectedIncomes.Count(e => e.ExpectedIncomeId == id) > 0;
        }
    }
}