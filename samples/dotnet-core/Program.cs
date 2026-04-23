using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddSingleton<ItemStore>();

var app = builder.Build();

app.MapGet("/api/items", (ItemStore store) => store.All());

app.MapGet("/api/items/{id:int}", (int id, ItemStore store) =>
{
    var item = store.FindById(id);
    return item is null ? Results.NotFound() : Results.Ok(item);
});

app.MapPost("/api/items", (Item item, ItemStore store) =>
{
    var created = store.Add(item.Name);
    return Results.Created($"/api/items/{created.Id}", created);
});

app.Run();

public record Item(int Id, string Name);

public class ItemStore
{
    private readonly List<Item> _items = new()
    {
        new Item(1, "Onboarding checklist"),
        new Item(2, "Weekly review"),
        new Item(3, "Ship the thing"),
    };
    private int _nextId = 4;

    public IEnumerable<Item> All() => _items;

    public Item? FindById(int id) => _items.FirstOrDefault(i => i.Id == id);

    public Item Add(string name)
    {
        var item = new Item(_nextId++, name);
        _items.Add(item);
        return item;
    }
}
