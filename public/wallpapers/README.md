# Wallpapers

The macOS shell uses a pure-CSS Sonoma gradient by default (see `.theme-macos --bg` in `src/app/globals.css`) — no asset needed to ship.

To swap to a real image:

1. Drop `sonoma.jpg` (or `sonoma.avif`, ~2560×1440) here.
2. In `src/os/macos/Shell.tsx`, replace the gradient `div` with `<Image src="/wallpapers/sonoma.jpg" fill priority />`.

Suggested sources: Apple's wallpaper downloads, `basicappleguy.com/basicappleblog/macos-sonoma-wallpapers`.
