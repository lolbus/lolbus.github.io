---
layout: page
title: Videos
permalink: /videos/
lede: Recordings of past work. Search by title, technology, employer or year.
---
{%- assign vids = site.data.videos | sort: 'date' | reverse %}
{%- assign alltags = '' | split: '' %}
{%- for v in vids %}{% for t in v.tags %}{% assign alltags = alltags | push: t %}{% endfor %}{% endfor %}
{%- assign alltags = alltags | uniq | sort_natural %}
<div class="vsearch" data-video-search>
  <label class="vsearch__label" for="vsearch-input">Search videos</label>
  <input class="vsearch__input" id="vsearch-input" type="search" placeholder="Search title, technology, employer, year" autocomplete="off">
  {%- if alltags.size > 0 %}
  <div class="vsearch__tags" role="group" aria-label="Filter by tag">
    {%- for t in alltags %}<button type="button" class="tagchip" data-tag="{{ t | downcase | escape }}" aria-pressed="false">{{ t }}</button>{% endfor %}
  </div>
  {%- endif %}
  <p class="vsearch__count" aria-live="polite"><span data-count>{{ vids.size }}</span> of {{ vids.size }} videos</p>
</div>
<div class="vgrid">
  {%- for v in vids %}
  {%- capture links -%}
    {%- for rid in v.roles -%}{%- assign r = site.data.experience | where: 'id', rid | first -%}{%- if r -%}<a href="{{ '/experience/' | relative_url }}#{{ r.id }}">{{ r.title }}</a>{%- endif -%}{%- endfor -%}
    {%- for pid in v.projects -%}{%- assign p = site.data.projects.items | where: 'id', pid | first -%}{%- if p -%}<a href="{{ '/projects/' | relative_url }}#{{ p.id }}">{{ p.title }}</a>{%- endif -%}{%- endfor -%}
  {%- endcapture -%}
  {%- capture searchtext -%}{{ v.title }} {{ v.summary }} {{ v.org }} {{ v.date | date: '%Y %B %b' }} {{ v.tags | join: ' ' }}{%- endcapture -%}
  <article class="vcard" id="{{ v.id }}" data-search="{{ searchtext | downcase | strip_newlines | escape }}" data-tags="{{ v.tags | join: '|' | downcase | escape }}">
    {%- if v.youtube_id %}
    <button type="button" class="vthumb" data-yt="{{ v.youtube_id }}" aria-label="Play {{ v.title | escape }}">
      <img src="https://i.ytimg.com/vi/{{ v.youtube_id }}/hqdefault.jpg" alt="" loading="lazy" onerror="this.parentNode.classList.add('no-thumb');this.remove()">
      <span class="vthumb__play" aria-hidden="true"></span>
    </button>
    {%- else %}
    <a class="vthumb no-thumb" href="{{ v.url }}" target="_blank" rel="noopener" aria-label="Open {{ v.title | escape }}"><span class="vthumb__play" aria-hidden="true"></span></a>
    {%- endif %}
    <div class="vcard__body">
      <h2 class="vcard__title">{% if v.youtube_id %}<a href="https://www.youtube.com/watch?v={{ v.youtube_id }}" target="_blank" rel="noopener">{{ v.title }}</a>{% else %}<a href="{{ v.url }}" target="_blank" rel="noopener">{{ v.title }}</a>{% endif %}</h2>
      <p class="vcard__meta">{{ v.date | date: site.date_format }}{% if v.duration %} · {{ v.duration }}{% endif %} · {{ v.org }}</p>
      <p class="vcard__summary">{{ v.summary }}</p>
      {%- if links != '' %}<p class="vcard__links">From: {{ links }}</p>{% endif %}
      {%- if v.tags %}<ul class="chips chips--small">{% for t in v.tags %}<li class="chip">{{ t }}</li>{% endfor %}</ul>{% endif %}
    </div>
  </article>
  {%- endfor %}
</div>
<p class="vempty" hidden>No videos match. Clear the search or tags.</p>
