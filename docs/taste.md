# Fresp taste bible

This file is what "good" and "bad" frontend means for Fresp.
The AI must follow this. It does not replace overflow and other facts.

## How Fresp judges

1. Facts from the live page (overflow, later clip, overlap, contrast).
2. What the product is (school, portfolio, app, hackathon demo).
3. What the goal is (ship tonight, Play Store, class project).
4. This bible, plus screenshots.

## Product types

### School site
Should feel alive: clear next action, readable type, not a gray HTML skeleton.
Bad: default Times text, no hierarchy, looks like a Word doc.

### Personal portfolio
Should make the person look real and specific.
Bad: generic purple gradient hero, fake Latin, same layout as every AI landing page.

### App / SaaS landing
Should say what it does in one screen.
Bad: vague slogans, five fonts, no proof.

### Hackathon demo
Should be obvious in 10 seconds.
Bad: empty nav, broken layout, cannot tell the idea.


## Never good (any product)

- Horizontal scroll for no reason
- Text you cannot read on the background
- Five fonts and random colors with no system
- Buttons that look like links or links that look like body text
- Hero that says nothing (Inspired. Empower. Solutions.)
- Lorem ipsum on a real product
- Same Inter + purple gradient + three feature cards as every generated site

## Goals

### Hackathon
Need: what it is, one screenshot-worthy view, nothing obviously broken. 
Fail: judges bounce in 5 seconds.

### Publish on the web
Need: mobile width, readable type, contact or next step, not embarrassing on phone.
Fail: desktop-only, overflow, looks unfinished.

### Play Store / app store listing site
Need: trust (what the app does, who it is for), screenshots or clear UI, not a meme page.
Fail: no idea what you download.

### School / class
Need: students can find the thing (schedule, login, event) fast. Can be fun, not chaotic.
Fail: pretty but nobody knows where to click.

## How the AI must answer

- Name the product type and goal it assumed.
- List fact failures first (overflow etc.).
- Then taste: vibe wrong, theme weak, story weak.
- Each issue: what is wrong, why it matters for THIS product, what to change (color, type, layout, copy).
- Do not invent bugs the screenshot does not show.
- Do not say "looks great" if facts failed.


## Example sites (not a web crawler)

Fresp does not scrape the whole internet.
The heat sheet can list 2 or 3 URLs the user picks
("these are portfolios I respect").
We screenshot those too and compare vibe, layout, density.
If no examples are given, judge only from this bible plus the user's pages.

## AI slop patterns

Call these out when they show up:

- Purple/blue mesh gradient hero with no product
- Three identical icon cards (Fast. Secure. Easy.)
- Fake 4.9 stars and 10k users
- Inter everywhere, 16px gray body, no personality
- Stock "team collaborating" photo
- Navbar with 8 links and no idea which is primary

## Ready or not

After facts + taste, pick one:

- Not ready (broken layout or cannot tell what it is)
- Ready for a hackathon / class demo
- Ready to publish if they fix the listed taste issues
- Ready to ship (rare; must have facts clean and vibe matching the product)

Never say Play Store ready if overflow failed or the screenshot is a blank page.