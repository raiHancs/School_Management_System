using SchoolManagement.Data;
using SchoolManagement.API.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace SchoolManagement.Services
{
    public sealed class AuthService(SchoolDbContext context)
    {
        public User? Login(string username, string password)
        {
            return context.Users.FirstOrDefault(u => u.Name == username && u.Password == password);
        }

        public static bool IsAdmin(User user)
        {
            return user.UserType.ToString().Equals("Admin", StringComparison.OrdinalIgnoreCase);
        }

        public static bool IsTeacher(User user)
        {
            return user.UserType.ToString().Equals("Teacher", StringComparison.OrdinalIgnoreCase);
        }
    }
}
