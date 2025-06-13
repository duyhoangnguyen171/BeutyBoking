using BookingSalonHair.DTOs;
using BookingSalonHair.Models;
using Microsoft.EntityFrameworkCore;

namespace SalonBooking.API.Data
{
    public class SalonContext : DbContext
    {
        public SalonContext(DbContextOptions<SalonContext> options) : base(options) { }

        public DbSet<Appointment> Appointments { get; set; }
        public DbSet<Contact> Contacts { get; set; }
        public DbSet<Gallery> Galleries { get; set; }
        public DbSet<Service> Services { get; set; }
        public DbSet<News> News { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<TimeSlot> TimeSlots { get; set; }
        public DbSet<StaffTimeSlot> StaffTimeSlots { get; set; }
        public DbSet<WorkShift> WorkShifts { get; set; }
        public DbSet<HistoryWorkShift> HistoryWorkShifts { get; set; }
        public DbSet<UserWorkShift> UserWorkShifts { get; set; }
        public DbSet<AppointmentService> AppointmentServices { get; set; }
        public DbSet<PasswordResetToken> PasswordResetTokens { get; set; }
        public DbSet<Category> Categories { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Customer - Appointment
            modelBuilder.Entity<Appointment>()
                .HasOne(a => a.Customer)
                .WithMany(u => u.CustomerAppointments)
                .HasForeignKey(a => a.CustomerId)
                .OnDelete(DeleteBehavior.Restrict);

            // Staff - Appointment
            modelBuilder.Entity<Appointment>()
                .HasOne(a => a.Staff)
                .WithMany(u => u.StaffAppointments)
                .HasForeignKey(a => a.StaffId)
                .OnDelete(DeleteBehavior.Restrict);

            // WorkShift - TimeSlot
            modelBuilder.Entity<WorkShift>()
                .HasMany(w => w.TimeSlots)
                .WithOne(ts => ts.WorkShift)
                .HasForeignKey(ts => ts.WorkShiftId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<PasswordResetToken>()
            .HasIndex(t => t.Token)
            .IsUnique();

            // StaffTimeSlot
            modelBuilder.Entity<StaffTimeSlot>()
            .HasKey(st => st.Id);
            modelBuilder.Entity<StaffTimeSlot>()
            .Property(st => st.Id)
            .ValueGeneratedOnAdd();
           

            modelBuilder.Entity<StaffTimeSlot>()
                .HasOne(st => st.Staff)
                .WithMany()
                .HasForeignKey(st => st.StaffId)
                .OnDelete(DeleteBehavior.Restrict);
            modelBuilder.Entity<StaffTimeSlot>()
    .HasIndex(x => new { x.StaffId, x.TimeSlotId })
    .IsUnique();

            modelBuilder.Entity<StaffTimeSlot>()
    .HasOne(st => st.TimeSlot)
    .WithMany()
    .HasForeignKey(st => st.TimeSlotId)
    .OnDelete(DeleteBehavior.Restrict);

            // WorkShift - Appointment
            modelBuilder.Entity<Appointment>()
                .HasOne(a => a.WorkShift)
                .WithMany(w => w.Appointments)
                .HasForeignKey(a => a.WorkShiftId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Appointment>()
            .HasOne(a => a.StaffTimeSlot)
            .WithMany()
            .HasForeignKey(a => a.StaffTimeSlotId)
            .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Service>()
            .HasOne(s => s.Category)
            .WithMany(c => c.Services)
            .HasForeignKey(s => s.CategoryId)
            .OnDelete(DeleteBehavior.SetNull);
            // Appointment - Service
            modelBuilder.Entity<AppointmentService>()
                .HasKey(x => new { x.AppointmentId, x.ServiceId });

            modelBuilder.Entity<AppointmentService>()
                .HasOne(x => x.Appointment)
                .WithMany(a => a.AppointmentServices)
                .HasForeignKey(x => x.AppointmentId);

            modelBuilder.Entity<AppointmentService>()
                .HasOne(x => x.Service)
                .WithMany(s => s.AppointmentServices)
                .HasForeignKey(x => x.ServiceId);

            // User - Contact
            modelBuilder.Entity<Contact>()
                .HasOne(c => c.User)
                .WithMany(u => u.Contacts)
                .HasForeignKey(c => c.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // User - Gallery
            modelBuilder.Entity<Gallery>()
                .HasOne(g => g.User)
                .WithMany(u => u.Galleries)
                .HasForeignKey(g => g.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // Unique Email
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            modelBuilder.Entity<User>()
                .Property(u => u.FullName)
                .IsRequired()
                .HasMaxLength(100);

            modelBuilder.Entity<Service>()
                .Property(s => s.Name)
                .IsRequired()
                .HasMaxLength(100);

            modelBuilder.Entity<Service>()
                .Property(s => s.Price)
                .HasPrecision(18, 2);

            // Appointment Date format
            modelBuilder.Entity<Appointment>()
                .Property(a => a.AppointmentDate)
                .HasColumnType("datetime2")
                .HasConversion(
                    v => v.ToUniversalTime(),
                    v => DateTime.SpecifyKind(v, DateTimeKind.Utc));

            // User - WorkShift
            modelBuilder.Entity<UserWorkShift>()
                .HasKey(uws => new { uws.UserId, uws.WorkShiftId });

            modelBuilder.Entity<UserWorkShift>()
                .HasOne(uws => uws.User)
                .WithMany(u => u.UserWorkShifts)
                .HasForeignKey(uws => uws.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<UserWorkShift>()
                .HasOne(uws => uws.WorkShift)
                .WithMany(ws => ws.UserWorkShifts)
                .HasForeignKey(uws => uws.WorkShiftId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
