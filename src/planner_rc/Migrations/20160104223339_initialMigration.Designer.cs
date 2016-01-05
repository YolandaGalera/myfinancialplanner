using System;
using Microsoft.Data.Entity;
using Microsoft.Data.Entity.Infrastructure;
using Microsoft.Data.Entity.Metadata;
using Microsoft.Data.Entity.Migrations;
using Api.Models;

namespace planner_rc.Migrations
{
    [DbContext(typeof(ApiContext))]
    [Migration("20160104223339_initialMigration")]
    partial class initialMigration
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
            modelBuilder
                .HasAnnotation("ProductVersion", "7.0.0-rc1-16348")
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("Api.Models.ApplicationUser", b =>
                {
                    b.Property<string>("Id");

                    b.Property<int>("AccessFailedCount");

                    b.Property<string>("Birthday");

                    b.Property<string>("ConcurrencyStamp")
                        .IsConcurrencyToken();

                    b.Property<string>("Country");

                    b.Property<string>("Email")
                        .HasAnnotation("MaxLength", 256);

                    b.Property<bool>("EmailConfirmed");

                    b.Property<bool>("LockoutEnabled");

                    b.Property<DateTimeOffset?>("LockoutEnd");

                    b.Property<string>("NormalizedEmail")
                        .HasAnnotation("MaxLength", 256);

                    b.Property<string>("NormalizedUserName")
                        .HasAnnotation("MaxLength", 256);

                    b.Property<string>("PasswordHash");

                    b.Property<string>("PhoneNumber");

                    b.Property<bool>("PhoneNumberConfirmed");

                    b.Property<string>("SecurityStamp");

                    b.Property<bool>("TwoFactorEnabled");

                    b.Property<string>("UserName")
                        .HasAnnotation("MaxLength", 256);

                    b.HasKey("Id");

                    b.HasIndex("NormalizedEmail")
                        .HasAnnotation("Relational:Name", "EmailIndex");

                    b.HasIndex("NormalizedUserName")
                        .HasAnnotation("Relational:Name", "UserNameIndex");

                    b.HasAnnotation("Relational:TableName", "AspNetUsers");
                });

            modelBuilder.Entity("Api.Models.ExpectedExpense", b =>
                {
                    b.Property<int>("ExpectedExpenseId")
                        .ValueGeneratedOnAdd();

                    b.Property<bool>("Deleted");

                    b.Property<string>("EncryptedValue");

                    b.Property<string>("Name");

                    b.Property<string>("UserId");

                    b.Property<float?>("Value");

                    b.HasKey("ExpectedExpenseId");
                });

            modelBuilder.Entity("Api.Models.ExpectedIncome", b =>
                {
                    b.Property<int>("ExpectedIncomeId")
                        .ValueGeneratedOnAdd();

                    b.Property<bool>("Deleted");

                    b.Property<string>("EncryptedValue");

                    b.Property<string>("Name");

                    b.Property<string>("UserId");

                    b.Property<float?>("Value");

                    b.HasKey("ExpectedIncomeId");
                });

            modelBuilder.Entity("Api.Models.Expense", b =>
                {
                    b.Property<int>("ExpenseId")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime>("Date");

                    b.Property<string>("EncryptedValue");

                    b.Property<int?>("ExpectedExpenseExpectedExpenseId");

                    b.Property<string>("UserId");

                    b.Property<float?>("Value");

                    b.HasKey("ExpenseId");
                });

            modelBuilder.Entity("Api.Models.Income", b =>
                {
                    b.Property<int>("IncomeId")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime>("Date");

                    b.Property<string>("EncryptedValue");

                    b.Property<int?>("ExpectedIncomeExpectedIncomeId");

                    b.Property<string>("UserId");

                    b.Property<float?>("Value");

                    b.HasKey("IncomeId");
                });

            modelBuilder.Entity("Microsoft.AspNet.Identity.EntityFramework.IdentityRole", b =>
                {
                    b.Property<string>("Id");

                    b.Property<string>("ConcurrencyStamp")
                        .IsConcurrencyToken();

                    b.Property<string>("Name")
                        .HasAnnotation("MaxLength", 256);

                    b.Property<string>("NormalizedName")
                        .HasAnnotation("MaxLength", 256);

                    b.HasKey("Id");

                    b.HasIndex("NormalizedName")
                        .HasAnnotation("Relational:Name", "RoleNameIndex");

                    b.HasAnnotation("Relational:TableName", "AspNetRoles");
                });

            modelBuilder.Entity("Microsoft.AspNet.Identity.EntityFramework.IdentityRoleClaim<string>", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("ClaimType");

                    b.Property<string>("ClaimValue");

                    b.Property<string>("RoleId")
                        .IsRequired();

                    b.HasKey("Id");

                    b.HasAnnotation("Relational:TableName", "AspNetRoleClaims");
                });

            modelBuilder.Entity("Microsoft.AspNet.Identity.EntityFramework.IdentityUserClaim<string>", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("ClaimType");

                    b.Property<string>("ClaimValue");

                    b.Property<string>("UserId")
                        .IsRequired();

                    b.HasKey("Id");

                    b.HasAnnotation("Relational:TableName", "AspNetUserClaims");
                });

            modelBuilder.Entity("Microsoft.AspNet.Identity.EntityFramework.IdentityUserLogin<string>", b =>
                {
                    b.Property<string>("LoginProvider");

                    b.Property<string>("ProviderKey");

                    b.Property<string>("ProviderDisplayName");

                    b.Property<string>("UserId")
                        .IsRequired();

                    b.HasKey("LoginProvider", "ProviderKey");

                    b.HasAnnotation("Relational:TableName", "AspNetUserLogins");
                });

            modelBuilder.Entity("Microsoft.AspNet.Identity.EntityFramework.IdentityUserRole<string>", b =>
                {
                    b.Property<string>("UserId");

                    b.Property<string>("RoleId");

                    b.HasKey("UserId", "RoleId");

                    b.HasAnnotation("Relational:TableName", "AspNetUserRoles");
                });

            modelBuilder.Entity("Api.Models.ExpectedExpense", b =>
                {
                    b.HasOne("Api.Models.ApplicationUser")
                        .WithMany()
                        .HasForeignKey("UserId");
                });

            modelBuilder.Entity("Api.Models.ExpectedIncome", b =>
                {
                    b.HasOne("Api.Models.ApplicationUser")
                        .WithMany()
                        .HasForeignKey("UserId");
                });

            modelBuilder.Entity("Api.Models.Expense", b =>
                {
                    b.HasOne("Api.Models.ExpectedExpense")
                        .WithMany()
                        .HasForeignKey("ExpectedExpenseExpectedExpenseId");

                    b.HasOne("Api.Models.ApplicationUser")
                        .WithMany()
                        .HasForeignKey("UserId");
                });

            modelBuilder.Entity("Api.Models.Income", b =>
                {
                    b.HasOne("Api.Models.ExpectedIncome")
                        .WithMany()
                        .HasForeignKey("ExpectedIncomeExpectedIncomeId");

                    b.HasOne("Api.Models.ApplicationUser")
                        .WithMany()
                        .HasForeignKey("UserId");
                });

            modelBuilder.Entity("Microsoft.AspNet.Identity.EntityFramework.IdentityRoleClaim<string>", b =>
                {
                    b.HasOne("Microsoft.AspNet.Identity.EntityFramework.IdentityRole")
                        .WithMany()
                        .HasForeignKey("RoleId");
                });

            modelBuilder.Entity("Microsoft.AspNet.Identity.EntityFramework.IdentityUserClaim<string>", b =>
                {
                    b.HasOne("Api.Models.ApplicationUser")
                        .WithMany()
                        .HasForeignKey("UserId");
                });

            modelBuilder.Entity("Microsoft.AspNet.Identity.EntityFramework.IdentityUserLogin<string>", b =>
                {
                    b.HasOne("Api.Models.ApplicationUser")
                        .WithMany()
                        .HasForeignKey("UserId");
                });

            modelBuilder.Entity("Microsoft.AspNet.Identity.EntityFramework.IdentityUserRole<string>", b =>
                {
                    b.HasOne("Microsoft.AspNet.Identity.EntityFramework.IdentityRole")
                        .WithMany()
                        .HasForeignKey("RoleId");

                    b.HasOne("Api.Models.ApplicationUser")
                        .WithMany()
                        .HasForeignKey("UserId");
                });
        }
    }
}
