using Api.Models;
using Microsoft.AspNet.Authorization;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Mvc;
using Microsoft.Data.Entity;
using planner.Models;
using planner.Services;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

// For more information on enabling Web API for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace planner.Controllers
{
    [Route("api/[controller]")]
    public class AccountController : Controller
    {
        private UserManager<ApplicationUser> userManager;
        private SignInManager<ApplicationUser> signInManager;
        private ApiContext apiContext;

        public AccountController(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager, ApiContext apiContext)
        {
            this.userManager = userManager;
            this.signInManager = signInManager;
            this.apiContext = apiContext;
        }

        //public IActionResult Login()
        //{
        //    return View();
        //}

        [Route("login")]
        [HttpPost]
        public async Task<IActionResult> Login([FromBody]LoginCredentials login, string returnUrl = null)
        {
            ApplicationUser user = await userManager.FindByEmailAsync(login.Email);
            var signInStatus = await signInManager.PasswordSignInAsync(user.UserName, login.Password, false, false);
            if (signInStatus == SignInResult.Success)
            {
                return new HttpStatusCodeResult(200);
            }
            return HttpUnauthorized();
        }

        [Route("logout")]
        [HttpPost]
        public IActionResult LogOut()
        {
            signInManager.SignOutAsync().Wait();
            return new HttpStatusCodeResult(200);
        }

        [Route("register")]
        [HttpPost]
        public async Task<IdentityResult> asyncRegister([FromBody]LoginCredentials login)
        {
            ApplicationUser user = new ApplicationUser { UserName = login.Email, Email = login.Email };
            return await userManager.CreateAsync(user, login.Password);
        }

        [Route("reset-forgotten-password-request")]
        [HttpPost]
        public void resetPasswordRequest([FromBody]LoginCredentials login)
        {
            ApplicationUser user = userManager.FindByEmailAsync(login.Email).Result;

            if (user == null)
            {
                throw new System.Exception("This mail does not exist in our database.");
            }

            string token = userManager.GeneratePasswordResetTokenAsync(user).Result;
            CustomEmail customEmail = new CustomEmail
            {
                passwordEmailFrom = "*",
                emailFrom = "financialplanner.questions@gmail.com",
                emailTo = login.Email,
                server = "smtp.gmail.com",
                message = "Hello " + login.Email + ", \nif you want to reset your password," +
                " please click in the following link: http://" + Request.Host.ToUriComponent() + "/#/reset-by-token?token=" 
                + WebUtility.UrlEncode(token) + "&email=" + WebUtility.UrlEncode(login.Email) + "\n\nMy Financial Planner Team",
                subject = " Password Reset - Financial Planner",
                port = 587
            };

            EmailService.sendEmailHttpClient(customEmail);
        }

        [Route("reset-forgotten-password")]
        [HttpPost]
        public async Task<IdentityResult> asyncResetPassword([FromBody] LoginCredentials login)
        {
            ApplicationUser user = userManager.FindByEmailAsync(login.Email).Result;
            return await userManager.ResetPasswordAsync(user, login.Token, login.Password);
        }

        private ApplicationUser getCurrentUser()
        {
            string currentUserName = User.Identity.Name;
            return apiContext.Users.FirstOrDefault(u => u.UserName == currentUserName);
        }

        [Authorize]
        [Route("user")]
        [HttpGet]
        public IActionResult GetUser()
        {
            ApplicationUser user = getCurrentUser();
            if (user == null)
            {
                return HttpNotFound();
            }

            return new ObjectResult(user);
        }

        [Authorize]
        [Route("updateuser/{id}")]
        public IActionResult PutUser(string id, [FromBody]ApplicationUser user)
        {

            if (id != user.Id)
            {
                return HttpBadRequest();
            }

            ApplicationUser userDb = getCurrentUser();
            if (user.Id != userDb.Id)
            {
                return HttpBadRequest();
            }

            userDb.Birthday = user.Birthday;
            userDb.Country = user.Country;
            userManager.SetUserNameAsync(userDb, user.UserName).Wait();

            try
            {
                apiContext.SaveChanges();
                signInManager.SignInAsync(userDb, true).Wait();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (getCurrentUser() == null)
                {
                    return HttpNotFound();
                }
                else
                {
                    throw;
                }
            }

            return new ObjectResult(userDb);
        }

        [Authorize]
        [Route("updatepassword")]
        [HttpPost]
        public async Task<IdentityResult> asyncUpdatePassword([FromBody] UpdatePasswordForm passwordForm)
        {
            ApplicationUser user = getCurrentUser();
            return await userManager.ChangePasswordAsync(user, passwordForm.OldPassword, passwordForm.NewPassword);
        }
    }
}
