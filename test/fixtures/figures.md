## Figures

Tufte emphasizes tight integration of graphics with text. Data, graphs, and
figures are kept with the text that discusses them. In print, this means they
are not relegated to a separate page. On the web, that means readability of
graphics and their accompanying text without extra clicks, tab-switching, or
scrolling.

Figures should try to use the `figure` element, which by default are constrained
to the main column. Don't wrap figures in a paragraph tag. Any label or margin
note goes in a regular margin note inside the figure. For example, most of the
time one should introduce a figure directly into the main flow of discussion,
like so:

<figure>
[^{-} From Edward Tufte, *Visual Display of Quantitative Information*, page 92.]
![Exports and Imports to and from Denmark & Norway from 1700 to 1780](https://edwardtufte.github.io/tufte-css/img/exports-imports.png)
</figure>

<figure class="fullwidth">
![Figurative map of the successive losses of the French Army in the Russian
campaign, 1812-1813](https://edwardtufte.github.io/tufte-css/img/napoleons-march.png)
</figure>
