# Corrected legacy Armatur

This subfolder preserves the original Armatur interface and longest-first
greedy idea as a working reference. It is intentionally simple and standalone.

Corrections: input validation, bounded integer quantities, explicit mm/cm/m
length units, millimetre-aware mass calculation, integer 0.1 mm length
arithmetic, correct waste formatting, and no floating-point termination loop.

The greedy choices are unchanged for valid inputs with no cutting kerf.
For better layouts and a saw-width setting, use the parent index page.

## Dedication

This tool was first created many years ago at the request of my friend
Purev-Erdene Munkhuu (Мөнхөөгийн Пүрэв-Эрдэнэ), to help with his work as chief
engineer on many major construction projects. It is dedicated to his memory.

## Credits and license

The original source is [gantemur/armatur at f937ba9](https://github.com/gantemur/armatur/tree/f937ba9ab252372858f2e81076f2663772f87fcb).
That historical revision did not include an explicit license. The owner
approved the MIT License for this distributed Armatur package on 3 November
2026. This corrected version and its accompanying documentation are licensed
under the [MIT License](LICENSE), copyright (c) 2020, 2026 Tsogtgerel Gantumur.
The full license is included here so this subfolder remains standalone.
No third-party runtime dependencies are bundled in this subfolder.

