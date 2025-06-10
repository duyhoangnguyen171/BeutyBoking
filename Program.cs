using SalonBooking.API.Data;
using BookingSalonHair.Interfaces;
using BookingSalonHair.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using BookingSalonHair.Service;
using BookingSalonHair.Helpers;
using BookingSalonHair.Converters;
using System.Text.Json.Serialization;
using BookingSalonHair.Models;
var builder = WebApplication.CreateBuilder(args);

// 1️⃣ Kết nối database (Sử dụng SqlServer)
builder.Services.AddDbContext<SalonContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.Configure<EmailSettings>(builder.Configuration.GetSection("EmailSettings"));
builder.Services.AddScoped<EmailHelper>();

// 2️⃣ Cấu hình CORS cho ứng dụng React (port 3001)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:3001", "http://localhost:5173") 
              .AllowAnyHeader()                 
              .AllowAnyMethod();                
    });
});

// 3️⃣ Cấu hình JWT Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],   // Cấu hình Issuer
            ValidAudience = builder.Configuration["Jwt:Audience"], // Cấu hình Audience
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"])) // Cấu hình Signing Key
        };

        options.Events = new JwtBearerEvents
        {
            OnAuthenticationFailed = context =>
            {
                Console.WriteLine("❌ Token không hợp lệ: " + context.Exception.Message);  // Xử lý lỗi khi token không hợp lệ
                return Task.CompletedTask;
            },
            OnForbidden = context =>
            {
                Console.WriteLine("⛔ Truy cập bị chặn tại: " + context.Request.Path);  // Xử lý lỗi khi quyền truy cập bị cấm
                return Task.CompletedTask;
            }
        };
    });

builder.Services.AddAuthorization();  // Thêm Authorization service để xác thực quyền truy cập

// 4️⃣ Cấu hình Dependency Injection cho các service
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<INewsService, NewsService>();
builder.Services.AddScoped<IAppointmentService, BookingSalonHair.Services.AppointmentService>();
builder.Services.AddScoped<IServiceService, ServiceService>();
builder.Services.AddScoped<IWorkShiftService, WorkShiftService>();
builder.Services.AddScoped<IContactService, ContactService>();
builder.Services.AddSingleton<JwtHelper>();

builder.Services.AddMemoryCache();
//Cấu hình Swagger và JWT Bearer cho Swagger UI
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.Preserve;
        options.JsonSerializerOptions.Converters.Add(new DateTimeConverterUsingDateTimeParse());
    });

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Title = "Booking Salon Hair API",
        Version = "v1"
    });

    // 🔐 JWT Bearer config cho Swagger UI
    options.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.ApiKey,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Description = "Nhập token: Bearer {token}"
    });

    options.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});

var app = builder.Build();

// 6️⃣ Middleware pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();                // Kích hoạt Swagger
    app.UseSwaggerUI();              // Kích hoạt Swagger UI
}

app.UseHttpsRedirection();          // Redirect tất cả request HTTP về HTTPS

// ⚠️ Phải đúng thứ tự này
app.UseCors("AllowReactApp");       // 🟡 CORS phải được áp dụng trước Authentication
app.UseAuthentication();            // 🟡 Authentication phải được áp dụng trước Authorization
app.UseAuthorization();             // 🟡 Authorization

app.MapControllers();               // Ánh xạ các API Controllers

app.Run();  // Chạy ứng dụng


