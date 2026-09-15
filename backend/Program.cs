using DotNetEnv;
using Npgsql;
using Dapper;

// Load .env
Env.Load(Path.Combine(Directory.GetCurrentDirectory(), ".env"));

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy
            .AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
});

var connectionString = Environment.GetEnvironmentVariable("DATABASE_URL");

if (string.IsNullOrWhiteSpace(connectionString))
{
    Console.Error.WriteLine("DATABASE_CONNECTION_STRING environment variable is not set.");
    Environment.Exit(1);
}

// Created once, reused across requests — Npgsql handles pooling internally
var dataSource = NpgsqlDataSource.Create(connectionString);

var app = builder.Build();

app.UseCors("AllowAll");

app.MapGet("/kartpop", async () =>
{
    try
    {
        await using var connection = await dataSource.OpenConnectionAsync();

        var results = await connection.QueryAsync<Municipality>("SELECT * FROM komlatlong");

        return Results.Ok(results);
    }
    catch (Exception ex)
    {
        Console.Error.WriteLine(ex.ToString());

        return Results.Problem(
            detail: ex.Message,
            statusCode: 500
        );
    }
});

var port = Environment.GetEnvironmentVariable("PORT") ?? "5000";

app.Urls.Add($"http://localhost:{port}");

app.Run();

public record Municipality(int Id, string Ssbid, string Kommune, double Lat, double Long);