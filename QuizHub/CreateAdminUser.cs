using Core.Entities;
using Infrastructure;

namespace QuizHub
{
    public class CreateAdminUser
    {
        public static void Create(ApplicationDbContext context)
        {
            // Provjeri da li admin već postoji
            var adminExists = context.Users.Any(u => u.Username == "admin");
            if (adminExists)
            {
                Console.WriteLine("Admin user already exists.");
                return;
            }

            // Kreiraj admin korisnika
            var passwordHash = BCrypt.Net.BCrypt.HashPassword("admin123");

            var adminUser = new User
            {
                Username = "admin",
                Email = "admin@quizhub.com",
                PasswordHash = passwordHash,
                Role = "Admin",
                ProfileImage = null
            };

            context.Users.Add(adminUser);
            context.SaveChanges();

            Console.WriteLine("Admin user created successfully!");
            Console.WriteLine("Username: admin");
            Console.WriteLine("Password: admin123");
        }
    }
}
