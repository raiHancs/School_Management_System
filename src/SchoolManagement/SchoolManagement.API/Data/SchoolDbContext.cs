using Microsoft.EntityFrameworkCore;
using SchoolManagement.API.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace SchoolManagement.Data
{
    public class SchoolDbContext : DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Class> Classes { get; set; }
        public DbSet<Subject> Subjects { get; set; }
        public DbSet<Student> Students { get; set; }
        public DbSet<Grade> Grades { get; set; }
        public DbSet<ClassSubject> ClassSubjects { get; set; }
        public DbSet<TeacherAssignment> TeacherAssignments { get; set; }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            base.OnConfiguring(optionsBuilder);
            if (!optionsBuilder.IsConfigured)
                optionsBuilder.UseSqlServer("Data Source=.\\SQLEXPRESS; Initial Catalog=WebSchool; User ID=developer; Password=123456; TrustServerCertificate=True;");
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(50);
                entity.Property(e => e.Email).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Password).IsRequired().HasMaxLength(16);
                entity.Property(e => e.UserType).IsRequired();
                entity.HasIndex(e => e.Email).IsUnique();
            });

            modelBuilder.Entity<Class>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(50);
                entity.Property(e => e.Description).HasMaxLength(200);
            });

            modelBuilder.Entity<Subject>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(50);
                entity.Property(e => e.Description).HasMaxLength(200);
            });

            modelBuilder.Entity<ClassSubject>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasOne(e => e.classes)
                    .WithMany(e => e.classSubjects)
                    .HasForeignKey(e => e.ClassId);
                entity.HasOne(e => e.subjects)
                    .WithMany(e => e.classSubjects)
                    .HasForeignKey(e => e.SubjectId);
            });

            modelBuilder.Entity<TeacherAssignment>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasOne(e => e.teachers)
                    .WithMany(e => e.teacherAssignments)
                    .HasForeignKey(e => e.TeacherId);
                entity.HasOne(e => e.classes)
                    .WithMany(e => e.teacherAssignments)
                    .HasForeignKey(e => e.ClassId);
                entity.HasOne(e => e.subjects)
                    .WithMany(e => e.teacherAssignments)
                    .HasForeignKey(e => e.SubjectId);
            });

            modelBuilder.Entity<Student>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(50);
                entity.Property(e => e.RollNumber).HasMaxLength(10);
                entity.HasOne(e => e.classes)
                    .WithMany(e => e.students)
                    .HasForeignKey(e => e.ClassId);
            });

            modelBuilder.Entity<Grade>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Term).IsRequired().HasMaxLength(20);
                entity.Property(e => e.ObtainMarks).HasColumnType("decimal(5,2)");
                entity.Property(e => e.TotalMarks).HasColumnType("decimal(5,2)");
                entity.Property(e => e.GradeLetter).HasMaxLength(5);
                entity.HasOne(e => e.students)
                    .WithMany(e => e.grades)
                    .HasForeignKey(e => e.StudentId);
                entity.HasOne(e => e.subjects)
                    .WithMany(e => e.grades)
                    .HasForeignKey(e => e.SubjectId);
            });
            base.OnModelCreating(modelBuilder);
        }
    }
}
