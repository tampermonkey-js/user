var gallery = ["zLlUYw{c", "WFzjS4JL", "*}MyM#{Q", "n*a$G]!}", "K!!FAF{E", "44BU(%!J", "byPj@}{&", "MMwNDUJx", "6GJc]c{2", "dAXr%kJl", "A(768W{q", "u@{{2eJv", "R5MNwm{e", "@zwyquJj", "iX!$k2{S", "%xEqJb!u", "lrSEDj{d", "Il2T]r!i", "2f*iNz{R", "ZZdxH7!W", "[Tr#B&{b", "q%5E)1!K", "N8ST#9{P", "{sz]5H!]", "sm$MzP{3", "PgabtX!8", "9EoqnJ{$", "g{25hR!w", "D&P]bZ{1", "x9dMVh!k", "U3$bPp{p", "hynlyNJ}"]
var mobs = ["qlCHeI9z", "[rp&kA]u", "Z[beqO9@", "vHpHAa]g", "BNF&GS9b", "eT%0Mg]s", "7Z0lSY9n", "G6sO{k]I", "j#e}Ey9Z", "#)Ql@q]U", "SB3W(i9P", "oM(}x*yG", "(S37389B", "XYTs90][", "00Fd&s9N", undefined, "4b}XzV9c", "4b}XzV9c", "nnu*@b9o", "9ymXVn]J", "P4YIbf9a", "s!K*ht]V"];
var l = gallery.length;
for (var i = 1; i <= l; i++) {
  localStorage["gallery_"+i] = gallery[i-1];
}
l = mobs.length;
for (var i = 1; i <= l; i++) {
  localStorage["mob_"+i] = mobs[i-1];
}
