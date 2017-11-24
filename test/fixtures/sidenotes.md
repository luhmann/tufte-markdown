One of the most distinctive features of Tufte's style is his extensive use of
sidenotes.[^3] Sidenotes are like footnotes, except they don't force the reader
to jump their eye to the bottom of the page, but instead display off to the side
in the margin. Perhaps you have noticed their use in this document already. You
are very astute.

[^3]: This is a sidenote.

<!-- break -->

If you want a sidenote without footnote-style numberings, then you want a margin
note.[^mn] On large screens, a margin note is just a sidenote that omits the
reference number. This lessens the distracting effect taking away from the flow
of the main text, but can increase the cognitive load of matching a margin note
to its referent text. However, on small screens, a margin note is like a
sidenote except its viewability-toggle is a symbol rather than a reference
number. This document currently uses the symbol ⊕ (`&\#8853;`), but it's up to
you.

[^mn]: {-} This is a margin note. Notice there isn't a number preceding the note. What happens if me make it span ac coulple of paragraphs? or add a link [Example](http://example.org)

<!-- break -->

<span class="newthought">In his later books</span>[^1], Tufte starts each
section with a bit of vertical space, a non-indented paragraph, and the first
few words of the sentence set in small caps. For this we use a span with the
class `newthought`, as demonstrated at the beginning of this paragraph. Vertical
spacing is accomplished separately through `<section>` tags. Be consistent:
though we do so in this paragraph for the purpose of demonstration, do not
alternate use of header elements and the `newthought` technique. Pick one
approach and stick to it.

[^1]: [Beautiful Evidence](http://www.edwardtufte.com/tufte/books_be)

<!-- break -->

[^rhino] But tight integration of graphics with text is central to Tufte's work
even when those graphics are ancillary to the main body of a text. In many of
those cases, a margin figure may be most appropriate. To place figures in the
margin, just wrap an image (or whatever) in a margin note inside a
<code>p</code> tag, as seen to the right of this paragraph.

[^rhino]: {-} ![Image of a Rhinoceros](https://placeimg.com/1000/600/tech) F.J. Cole, "The History of Albrecht Dürer's Rhinoceros in Zooological Literature," _Science, Medicine, and History: Essays on the Evolution of Scientific Thought and Medical Practice_ (London, 1953), ed. E. Ashworth Underwood, 337-356. From page 71 of Edward Tufte's _Visual Explanations_.

<!-- break -->

If you need a full-width figure, give it the `fullwidth` class. Make sure that's
inside an `article`, and it will take up (almost) the full width of the screen.
This approach is demonstrated below using Edward Tufte's English translation of
the Napoleon's March data visualization. From _Beautiful Evidence_, page
122-124.

<figure class="fullwidth">
![Figurative map of the successive losses of the French Army in the Russian
campaign, 1812-1813](https://placeimg.com/1000/600/tech)
</figure>

<!-- break -->

<figure>
[^{-} From Edward Tufte, *Visual Display of Quantitative Information*, page 92.]
![Exports and Imports to and from Denmark & Norway from 1700 to 1780](img/exports-imports.png)
</figure>
