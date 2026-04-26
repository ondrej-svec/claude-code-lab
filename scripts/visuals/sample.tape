# Sample vhs tape — proves the rose-pine-moon theme + JetBrains Mono renders
# correctly at the lab's standard chapter image dimensions.
#
# Usage:
#   vhs scripts/visuals/sample.tape
# Output:
#   public/visuals/sample.webm

Output public/visuals/sample.webm

Set Theme "rose-pine-moon"
Set FontFamily "JetBrains Mono"
Set FontSize 14
Set Width 1200
Set Height 600
Set Padding 20
Set Framerate 30
Set TypingSpeed 40ms
Set Shell zsh

# A representative agent-coding interaction.
Type "claude" Sleep 400ms Enter
Sleep 800ms
Type "/help" Sleep 300ms Enter
Sleep 1200ms
Type "Add a /usage command that shows context budget" Sleep 200ms Enter
Sleep 2500ms
