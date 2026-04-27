using System.Text.Json;
using System.Text.Json.Serialization;
using CCLab.Sample.Boot;
using CCLab.Sample.Models;
using CCLab.Sample.Stores;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddSingleton<EntryStore>();
builder.Services.ConfigureHttpJsonOptions(options =>
{
    options.SerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
    options.SerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.Never;
});

var app = builder.Build();

// First-run cinematic moment. Marker file in the working directory
// suppresses the boot on subsequent runs. Delete .guide-booted to
// replay it.
const string BootedMarker = ".guide-booted";
if (!File.Exists(BootedMarker))
{
    await BootSequence.Play();
    await File.WriteAllTextAsync(BootedMarker, DateTimeOffset.UtcNow.ToString("o"));
}
else
{
    Console.WriteLine($"Sub-Etha relay online · http://localhost:5100");
}

app.MapGet("/api/entries", (EntryStore store, string? locale) => store.All(locale));

app.MapGet("/api/entries/{id:int}", (int id, EntryStore store) =>
{
    var entry = store.FindById(id);
    return entry is null ? Results.NotFound() : Results.Ok(entry);
});

app.MapPost("/api/entries", (EntryInput input, EntryStore store) =>
{
    if (string.IsNullOrWhiteSpace(input.Title) || string.IsNullOrWhiteSpace(input.Body))
        return Results.BadRequest(new { error = "title and body are required" });
    var created = store.Add(input);
    return Results.Created($"/api/entries/{created.Id}", created);
});

app.Run();
