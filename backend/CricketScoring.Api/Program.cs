using CricketScoring.Api.Services;
using Google.Apis.Auth.OAuth2;
using Google.Cloud.Firestore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure CORS for Angular frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular", policy =>
    {
        policy.WithOrigins("http://localhost:4200", "http://localhost:7191")
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

// Configure Firestore
var projectId = builder.Configuration["Firebase:ProjectId"] 
    ?? Environment.GetEnvironmentVariable("GOOGLE_CLOUD_PROJECT");

if (string.IsNullOrEmpty(projectId))
{
    throw new InvalidOperationException(
        "Firebase ProjectId is not configured. Please set it using one of these methods:\n" +
        "1. User Secrets: dotnet user-secrets set \"Firebase:ProjectId\" \"your-project-id\" --project .\\backend\\CricketScoring.Api\n" +
        "2. appsettings.json: Update the Firebase:ProjectId value\n" +
        "3. Environment Variable: Set GOOGLE_CLOUD_PROJECT");
}

var credentialsPath = builder.Configuration["Firebase:CredentialsPath"] 
    ?? Environment.GetEnvironmentVariable("GOOGLE_APPLICATION_CREDENTIALS");

if (string.IsNullOrEmpty(credentialsPath) || !File.Exists(credentialsPath))
{
    throw new InvalidOperationException(
        "Firebase credentials file not found. Please set it using one of these methods:\n" +
        "1. User Secrets: dotnet user-secrets set \"Firebase:CredentialsPath\" \"C:\\\\path\\\\to\\\\service-account.json\"\n" +
        "2. Environment Variable: $env:GOOGLE_APPLICATION_CREDENTIALS=\"C:\\\\path\\\\to\\\\service-account.json\"\n" +
        (string.IsNullOrEmpty(credentialsPath) 
            ? "No credentials path was configured." 
            : $"File not found at: {credentialsPath}"));
}

Environment.SetEnvironmentVariable("GOOGLE_APPLICATION_CREDENTIALS", credentialsPath);

FirestoreDb firestoreDb;
try
{
    var credential = GoogleCredential.FromFile(credentialsPath);
    var firestoreBuilder = new FirestoreDbBuilder
    {
        ProjectId = projectId,
        Credential = credential
    };
    
    firestoreDb = firestoreBuilder.Build();
}
catch (Exception ex)
{
    throw new InvalidOperationException(
        "Failed to initialize Firestore. Please ensure:\n" +
        "1. You've downloaded the service account JSON from Firebase Console (Project Settings > Service Accounts)\n" +
        "2. The credentials file path is correct: " + credentialsPath + "\n" +
        "3. The service account has Firestore permissions\n" +
        "Error: " + ex.Message, ex);
}

builder.Services.AddSingleton(firestoreDb);

// Register services
builder.Services.AddScoped<IFirestoreService, FirestoreService>();
builder.Services.AddScoped<AuthService>();

// Add JWT Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
        };
    });

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowAngular");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
