# 05 - YUI (@m.ndgn_y), Japanese Web Designer

|              |                                                                                                               |
| ------------ | ------------------------------------------------------------------------------------------------------------- |
| **Source**   | https://www.instagram.com/m.ndgn_y/ - 𝕐𝕌𝕀, "Web制作×AIで働き方をつくる", 19.9k followers                      |
| **Read**     | 2026-09-07. **All 35 reels enumerated, all 35 captions read in full, 4 watched frame by frame**               |
| **Kind**     | A working Japanese web designer's teaching account. Web design instructor, one published book, three children |
| **Why this** | Listed as "a Japanese web designer - figure out her trick at creating beautiful websites"                     |

> **Language note.** Every caption is Japanese. Translations below are mine; the original is quoted alongside anything
> load-bearing so the claim can be checked rather than taken on trust.

## What It Actually Does

**The account is not a portfolio, and that changes what it is worth to us.** It is a teaching account with two streams,
and only one of them is about design:

| Stream                                                                | Format                                                                           | Reach              |
| --------------------------------------------------------------------- | -------------------------------------------------------------------------------- | ------------------ |
| **「Claudeに◯◯を見せた結果…」** - "The result of showing Claude a ◯◯" | She shows Claude a physical object and it builds a complete fictional brand site | **31k-442k views** |
| **Web Creator Notes**                                                 | Freelance career advice - rates, clients, working with children                  | 7k-31k views       |

**The design stream is the one to study, and it is one repeated experiment.** Across the eleven captions read in full,
the input is always a physical artefact: a chocolate packet, a mushroom-snack box, a donut shop's paper menu, an event
flyer, a sandwich shop's business card, a child's sticker album, a bag of HARIBO, a child's drawing.

**And the output is never a copy of that artefact.** It is a different, invented brand that obeys the artefact's rules.

## The Decision Behind It

**Her method, in her own sentence.** From the Apollo post, her best performer at 6,293 likes:

> 似たデザインを作らせるのではなく、元のデザインが持つルールを見つけて、別のブランドへ翻訳する使い方です
>
> _Not making it produce a similar design, but finding the rules the original design has, and translating them to a
> different brand._

**That is the whole trick, and everything else follows from it.** Four consequences, each of which she demonstrates.

### 0. She Publishes The Prompt Architecture, And It Is The Whole Answer

**The format's origin post, 27 August, states the method as four rules.** It opens by naming the failure mode the rules
exist to prevent:

> ただ「この画像を参考にサイトを作って」だけだと、それっぽい配色に寄せただけのサイトになりやすいです
>
> _If you only say "make a site referencing this image", you easily end up with a site that has merely leaned toward a
> vaguely similar palette._

**That sentence is a precise description of what a generated-looking page is**, and the four rules are the correction:

| #   | Her rule                                                                      | What it says                                                                                                                    |
| --- | ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| ①   | 画像をそのままコピーさせない - _do not let it copy the image_                 | First make it analyse the design characteristics: **colour, shape, whitespace, line, typography**                               |
| ②   | 分析した特徴をWeb用に再構成する - _restructure the analysed features for web_ | Not reproducing the packaging - converting into a structure that works as a site: header, first view, product introduction, CTA |
| ③   | 世界観を細かく指定する - _specify the worldview in detail_                    | Not "cute" but **thick outlines, rounded parts, pop palette** - verbalise the elements that compose the look                    |
| ④   | アニメーションをしっかり入れる - _put motion in properly_                     | Scroll, hover, float, bounce, specified generously. She adds: 「ここ、かなり大事でした」 - _this mattered a lot_                |

**And she compresses it into one line that is worth memorising:**

> 「何を作って」だけじゃなくて **何を読み取るか → どう変換するか → どう動かすか**
> まで指示すると、仕上がりがかなり変わります
>
> _Rather than only "make me X", instruct_ **what to read → how to convert → how to move** _, and the finish changes
> considerably._

**Rule ① is the load-bearing one.** Analysis before generation is what stops the model reaching for its defaults, and
"whitespace" and "line" being in that list - not just colour and font - is why her results have structure rather than
just a palette.

### 0b. And She Has A Second Mode, Which Is The Opposite

**The child's-drawing post is the most interesting thing on the account** because it deliberately breaks her own rules
and she says why.

She showed Claude her child's drawing of a Ditto eating candy at a festival. **Claude misread the drawing.** It read the
stall sign 「あめ」 (_candy_) as 「まめ」 (_bean_), and interpreted the spiral lollipop as a mouth. What came back was a
website for beans, carrying lines like 「まめ、公園にいます。」 - _Beans are in the
park._ - 「大きさが、まちがっています。」 - _The size is wrong._ - and 「ぜんぶ、まめのいちぶです。」 - _Everything is
part of the bean._

Her conclusion:

> 普段AIを仕事で使うときは、欲しい結果に近づけるために細かく指示することが多い。でも今回は、あえて解釈を任せたことで自分では絶対に思いつかないデザインになった
>
> _Normally when I use AI for work I instruct in detail to get close to the result I want. But this time, by
> deliberately leaving the interpretation to it, I got a design I could never have thought of myself._

**So the method is two modes, chosen deliberately**: the four rules when the output has to hit a brief, and surrendered
interpretation when the job is to find something you would not have reached. **The mistake is running the loose mode
when you needed the tight one**, which is what "make me a nice landing page" is.

### 1. She Extracts Rules, Not Adjectives

For the Apollo packet she lists what Claude found, and the list is the interesting part:

- 赤、ピンク、チョコレート色の配色 - a red, pink and chocolate palette
- 太くて丸い文字 - thick, round lettering
- 繰り返し並ぶいちご - strawberries repeating in a row
- Apollo's 円すい形 - the cone, as the brand's symbol
- 星 - the star, meaning _you won_
- **情報量が「密、疎、密」と変化する構成 - a structure whose information density goes dense, sparse, dense**

**The sixth one is the one nobody writes down.** It is not a colour or a shape, it is a _rhythm_, and she carried it
into the page: 「パッケージの情報量のリズムまで、Webサイトの構成に取り入れています」 - _the packaging's
information-density rhythm was taken into the website's structure._

**Verified by watching it.** Scrolling the resulting site (トンガリベリー, a fictional strawberry soft-serve stand) the
background moves **red → cream → pink → dark chocolate → red**, and the sections alternate between crowded product grids
and near-empty statements. It is visible in the recording, not just claimed in the caption.

### 2. Contrast Between Sections, Not One Brand Colour Everywhere

From the HARIBO post, where Claude invented a fictional soda-gummy brand called JUWARI:

> デザインも黄色だけで統一せず、商品紹介はクリーム、印象を変えたいところでは青、最後の導線では赤、とセクションごとに**メリハリ**がある
>
> _The design doesn't unify on yellow alone - the product introduction is cream, blue where it wants to shift the
> impression, red at the final call to action. Each section has_ **merihari** _(deliberate modulation)._

**メリハリ has no clean English equivalent and it is the most useful word in this study.** It means intentional
alternation between tension and release. The generated-looking page picks one accent and applies it to every button;
this picks a different ground per section **because each section is doing a different job**.

### 3. Choose Material The Tool Is Good At

The sharpest practical finding, from the Caprico post:

> Claudeは人物や、おにぎりのような微妙な丸みのある形をイラストにするのは少し苦手。反対に、カプリコ、アポロ、きのこの山のような、特徴がはっきりした単純な形はかなり得意です。CSSやSVGで再現しやすい形だから、崩れにくいうえに、回す、跳ねる、並べるといったアニメーションにも展開しやすい
>
> _Claude is a bit weak at illustrating people, or subtly-rounded shapes like onigiri. Conversely it is quite good at
> clearly-featured simple shapes. Because they are shapes that are easy to reproduce in CSS or SVG, they do not break,
> and they extend easily into animation - spin, bounce, arrange._

Her conclusion: 「AIに作らせるときは、プロンプトだけではなく『AIが作りやすい素材を選ぶ』のも大事そうです」 - _it is not
only the prompt; choosing material the AI finds easy to make matters too._

**This inverts the usual advice.** Everyone tries to write a better prompt. She changes the input so the output cannot
go wrong: **pick motifs that are native CSS and SVG geometry** - a cone, a circle, a star, an umbrella - and they stay
crisp, scale, and animate.

### 4. Every Site Has One Mechanic, Tied To The Brand

She calls the goal 「見るだけじゃないサイト」 - _a site you don't just look at_. Each build has exactly one interaction,
and it is always an expression of what the brand is:

| Site                                     | The mechanic                                                                                                                           |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| **みずたま水族館**, from a sticker album | Pinch a sticker and stick it into the tank. 13 creatures, 3 not yet in the aquarium; releasing 10, 20, 35 stickers reveals deeper ones |
| **HARERU**, a fictional soda             | Five sliders rebuild the glass live; MIX finishes it and it joins your collection                                                      |
| **Donut menu → ordering site**           | Choose, customise toppings, add to cart, pick a collection time, **and a receipt prints**                                              |
| **あまやどり**, from a mushroom snack    | Rain falls; a rainbow appears in the story section                                                                                     |
| **JUWARI**, from HARIBO                  | Press the fruit; parts move on scroll                                                                                                  |

**The aquarium one is the strongest**, because the mechanic reproduces the _feeling_ of the source object rather than
its look: 「シール帳の見た目だけではなく、ページを埋めたくなる感覚まで Webサイトへ変換されていました」 - _not only the
sticker book's appearance, but the urge to fill the page, was converted into the website._

## What Transfers To Us

**She is working in exactly our medium.** The recordings show Claude's artifact viewer - the titlebar reads
`Mizutama aquarium · HTML` with a コピー button. **These are single self-contained HTML files**, which is precisely what
`docs/prototype/travel-planner-slides.html` already is. Nothing about her method needs a framework we do not have.

**1. Give the rebuild a source artefact instead of a mood.** Our prototype's palette currently comes from nowhere. The
method says: find one real object from the trip - a Yogyakarta batik, a Malaysian bus ticket, a KTM boarding pass, a
paper temple entry ticket - extract its rules, and translate them. **The result cannot look generated because it did not
come from a generator's defaults.**

**2. Adopt メリハリ per section.** Right now every page of the deck sits on the same ground. The vote, the itinerary,
the disruption alert and the checklist are four different jobs and should not share one background. **The alert
especially** - it is the moment the product's claim fires, and it should not look like the section above it.

**3. Write the value readout in the product's voice.** On the HARERU control panel each slider shows a word, not a
number: いちごの濃さ reads 「ばくはつ」 (_explosion_), レモンの酸っぱさ reads 「かみなり」 (_thunder_). **Nothing says
"95%".** We already have the instinct - DrxgClanPC's badges say `on Day 3` and `4.6 km off Day 3` rather than printing a
distance - and this is the principle behind it, stated. Extend it to the vote and the budget.

**4. Underline only the surprising half of the sentence.** The aquarium headline
reads「全13種。3種は、まだ館内にいません。」 - _All 13 species. Three are not in the aquarium yet._ A yellow marker
underline runs under **the second clause only**. It is a complete sentence with a full stop, and the highlight lands on
the twist. Our itinerary headings are labels; **a heading that states a fact and marks the surprising part of it is free
and it is better.**

**5. Pick motifs that are CSS and SVG geometry.** For a trip planner that means a route line, a pin, a stamp circle, a
ticket notch, a boarding-pass tear. Avoid illustrated people and soft organic blobs, which is exactly where she says the
tool degrades.

**6. One mechanic, and make it the bench.** She gives each site a single interaction that _is_ the brand. Ours is not in
question: **a stop closes, and the itinerary repairs itself from the bench.** That is our aquarium sticker. It should be
the one thing on the page that moves.

## What Does Not, And Why

**Her sites are consumer-brand pieces and ours is a utility.** Confetti when the drink is finished, a rainbow in the
rain-gear story, a receipt that prints - these work because the subject is a sweet or a toy and delight is the point.
**Aisyah at midnight, checking whether a place opens on Sunday, is not in a playful mood**, and a planner that
celebrates at her would read as not understanding the problem. Take the _structure_ of one motivated mechanic; do not
take the whimsy.

**The vertical-video framing is not our format.** Her work is composed for a 1080×1920 phone recording with a
desktop-browser inset, big Japanese caption bars top and bottom, and a 13-18 second arc. **We are judged on a 3-5 minute
landscape video and static mockups**, so her pacing and framing teach us nothing directly.

**The whole account is single-page brand sites with no state.** None of these has a group, a shared decision, a saved
plan or anything that has to survive a second visit. Everything we are actually hard about - derived state, a vote that
produces an itinerary, a repair that has to be trustworthy - is outside what her method has been tested on.

**And her own caveat should be carried over.**
「このまま完成品として使うというより サイト制作の叩き台として使うのがおすすめ」 - _rather than using it as a finished
product as-is, I recommend using it as a_ 叩き台 _(a first board to beat on)_. She is explicit that a designer then
adjusts structure and layout. **The method produces a strong start, not a finish.**

## Checked Against The Tells

**Her work avoids the list structurally rather than by taste, which is the point of studying it.**

| Tell                                               | Why her method does not produce it                                           |
| -------------------------------------------------- | ---------------------------------------------------------------------------- |
| Inter or Space Grotesk as the safe default         | The typeface is inherited from a physical artefact, so it is never a default |
| One accent colour, everywhere                      | メリハリ - the ground changes per section, by job                            |
| Everything centre aligned                          | Layout follows the source's density rhythm, not a template                   |
| One large radius on every surface                  | Radius comes from the object - a cone, a sticker, a ticket                   |
| Numbered markers on things that are not a sequence | The mechanic is the structure; there is nothing left to fake ordering with   |

**The one risk her method carries is different and worth naming:** translating from a real product can slide into
copying it. She handles it explicitly and we should copy the handling, not just the design. Every design post carries a
disclaimer - the site is fictional, never published or sold, no partnership with the brand, the name and logo were not
reproduced, **only colour, shape and atmosphere were analysed**, and existing characters were not used. Her Kinoko no
Yama post says it plainly: 「商品名やロゴを再現せず、色・形・雰囲気だけを抽出して、架空ブランドに変換しています」.

**That is the correct posture for a repo that goes public on 13 September**, and it is the same instinct as our own
provenance note on `scripts/demo/`. If we take a real artefact as our source, the README says which one and says what we
took.

## Her Stated Working Setup

Recorded because it is cheap to copy and she gives exact values:

| Setting | Value                                                                                                                     |
| ------- | ------------------------------------------------------------------------------------------------------------------------- |
| Model   | **Claude Opus 5**                                                                                                         |
| Effort  | **High** (エフォート：高)                                                                                                 |
| When    | 「Webサイトのような複雑な制作では、私は基本的にこの設定を使っています」 - her default for complex site work               |
| Caveat  | 「同じプロンプトと設定でも、生成結果は毎回変わります」 - _the same prompt and settings give different results every time_ |

**Her pipeline, named in the HARIBO caption:** 企画 → 世界観 → コンテンツ → 実装 - **concept → worldview → content →
implementation.** She lets the model do the first step rather than specifying the finished form,
asking「この素材から何が作れそう？」 - _what could you make from this material?_ - which is where the fictional brand
comes from.

## Sample And Limits

**All 35 reels on the profile were enumerated and all 35 captions read in full.** Four were watched frame by frame - the
Apollo, HARERU, aquarium and rain-gear builds.

**The design series is exactly 11 posts spanning 27 August to 6 September 2026**, an eleven-day run of one repeated
experiment. The other 24 are her older stream of freelance career advice, going back to February, plus two study-log
posts from 2024.

**The format outperforms her own baseline by an order of magnitude**, which is worth noting because it is evidence the
approach reads as fresh to an audience of designers, not only to us:

| Stream                          | Likes, range                |
| ------------------------------- | --------------------------- |
| Career advice, 24 posts         | 42 - 175, typically         |
| **The design series, 11 posts** | **74 - 6,293**, median ~700 |

The single best performer is the Apollo build at **6,293 likes**, and the format's origin post - the one carrying the
four prompt rules - is second at **2,748**.

**Nothing here is from the pinned comments**, where she puts the actual prompts. Several captions
say「使ったプロンプトは固定コメントへ」 and one notes an English prompt is there too. **Those prompts are the most
valuable unread thing about this account**, and reading them is a follow-up worth doing before the rebuild starts.
