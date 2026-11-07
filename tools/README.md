# Forwarding pages (former tool location)

Until 2026-11-07, Sol tools lived in `tools/<tool-id>/`. They now live at the
repository root, in `<tool-id>/`, and are served at
`https://gantemur.github.io/sol/<tool-id>/`.

This folder keeps one small page at every former HTML address, for example
`tools/khurd/index.html` and `tools/doppler/sound.html`. Each page sends the
visitor to the same page at its new address and keeps any `?lang=` choice or
`#` fragment, so old links and bookmarks keep working.

Do not add tools or other files here. New tools go at the root and need no
forwarder. `node scripts/check-static.js` checks that every page here forwards
to an existing page.
