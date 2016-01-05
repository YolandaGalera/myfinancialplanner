using Api.Models;
using Api.Services;
using Microsoft.AspNet.Builder;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.Data.Entity;
using Microsoft.Extensions.DependencyInjection;

namespace planner_rc
{
    public class Startup
    {
        // For more information on how to configure your application, visit http://go.microsoft.com/fwlink/?LinkID=398940
        public void ConfigureServices(IServiceCollection services)
        {
            // Register Entity Framework
            services.AddEntityFramework()
                .AddSqlServer()
                .AddDbContext<ApiContext>(options =>
                {

                });

            // add ASP.NET Identity
            services.AddIdentity<ApplicationUser, IdentityRole>()
                .AddEntityFrameworkStores<ApiContext>().AddDefaultTokenProviders();
            services.AddMvc();
        }

        public void Configure(IApplicationBuilder app)
        {
            EncryptionService.GenerateKeyAndInitializationVectorIfNeeded();
            EncryptionService.LoadProperties();
            // Add the platform handler to the request pipeline.
            app.UseIdentity();
            app.UseIISPlatformHandler();
            // Add static files to the request pipeline.
          
            app.UseDefaultFiles(new Microsoft.AspNet.StaticFiles.DefaultFilesOptions() { DefaultFileNames = new[] { "index.html" } });
            app.UseStaticFiles();
            app.UseMvcWithDefaultRoute();
           
        }
    }
}
