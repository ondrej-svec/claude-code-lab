using Spectre.Console;

namespace CCLab.Sample.Boot;

// Cinematic moment — the .NET twin of the React frontend's CRT boot.
// Codified in docs/cc-lab-design-system.md as a "Cinematic moment":
// one-shot per install (gated by .guide-booted marker file in cwd),
// dismissible (Ctrl-C exits), narratively meaningful, under 3s.
public static class BootSequence
{
    private static readonly string[] Lines =
    {
        "[bold #56949f]>[/] [#9ccfd8]initializing sub-etha relay…[/]",
        "[bold #56949f]>[/] [#9ccfd8]infinite improbability drive: stable[/]",
        "[bold #56949f]>[/] [#9ccfd8]the guide is now open[/]",
    };

    public static async Task Play()
    {
        AnsiConsole.WriteLine();
        AnsiConsole.Write(new Rule("[#56949f]The Hitchhiker's Guide to the Galaxy[/]")
            .RuleStyle("dim #56949f")
            .LeftJustified());
        AnsiConsole.WriteLine();

        foreach (var line in Lines)
        {
            AnsiConsole.MarkupLine($"  {line}");
            await Task.Delay(420);
        }

        AnsiConsole.WriteLine();
        AnsiConsole.MarkupLine("  [bold #f6c177]DON'T  PANIC[/]");
        AnsiConsole.WriteLine();

        var panel = new Panel(new Markup(
            "[bold #e0def4]On the towel, and why you should always know where it is[/]\n\n" +
            "[#908caa]A towel is about the most massively useful thing an interstellar[/]\n" +
            "[#908caa]hitchhiker can have. Partly it has great practical value: wrap it[/]\n" +
            "[#908caa]around you for warmth on the cold moons of Jaglan Beta, sleep[/]\n" +
            "[#908caa]under it on the marble-sanded beaches of Santraginus V, wet it[/]\n" +
            "[#908caa]for use in hand-to-hand combat.[/]\n\n" +
            "[dim]Ford Prefect  ·  27 Apr 2026  ·  #preparedness #essentials[/]"
        ))
        {
            Border = BoxBorder.Rounded,
            BorderStyle = new Style(foreground: Color.FromHex("#56949f")),
            Padding = new Padding(2, 1, 2, 1),
            Header = new PanelHeader(" [bold #9ccfd8]● MOSTLY HARMLESS[/] ", Justify.Right),
        };
        AnsiConsole.Write(panel);

        AnsiConsole.WriteLine();
        await Task.Delay(700);
    }
}
