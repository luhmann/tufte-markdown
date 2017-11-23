import unified from 'unified'
import markdown from 'remark-parse'
import html from 'remark-html'
import react from 'remark-react'
// import highlight from 'remark-highlight.js'
import math from 'remark-math'
import katex from 'remark-html-katex'
import slug from 'remark-slug'
import textr from 'remark-textr'
import textrBase from 'typographic-base'

import sidenotes from '@tufte-markdown/remark-sidenotes'
import wrapInSection from '@tufte-markdown/remark-wrap-in-section'
import tufteFigureParser from '@tufte-markdown/remark-figure-parser'
import tufteFigureTransformer from '@tufte-markdown/remark-figure-transformer'

const parser = (options = {}) => {
  return (
    unified()
      .use(markdown, {
        commonmark: true,
        footnotes: true,
      })
      .use(math)
      .use(katex)
      // .use(highlight)
      .use(slug)
      .use(textr, {
        plugins: [textrBase],
      })
      .use(tufteFigureParser)
      .use(tufteFigureTransformer)
      .use(sidenotes)
      .use(wrapInSection)
      .use(options.react ? react : html)
  )
}

export default parser
