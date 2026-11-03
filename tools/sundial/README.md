# Sundial

Horizontal apparent-solar-time dial pattern generator. SVG, PDF, and PNG exports, with optional triangular gnomon profile.

The mathematical hour-line angle is atan2(abs(sin(latitude))*sin(hourAngle), cos(hourAngle)). Hour angle is 15 degrees per apparent solar hour from noon. Output sizes are in millimetres. Special equatorial and polar constructions are excluded.

The implementation is standalone static JavaScript. It is newly authored for Sol and uses no external libraries. See LICENSE for the MIT license. The user's own fabricated pattern is not subject to any additional visible-credit requirement.

Reference: https://t8m8r.wordpress.com/2020/05/05/sundial/

Browser, PDF, and physical printing checks are still pending.
