using Microsoft.AspNet.Mvc;

// For more information on enabling MVC for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace planner_rc.Controllers
{
    public class HomeController : Controller
    {
        [Route("{*url}")]
        // GET: /<controller>/
        public IActionResult Index()
        {
            return View();
        }
    }
}
