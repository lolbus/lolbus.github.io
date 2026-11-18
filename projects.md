---
layout: page
title: Projects
permalink: /projects/
lede: Professional work, MSc coursework and coding projects going back to 2009.
---
{%- for g in site.data.projects.groups %}
{%- assign gitems = site.data.projects.items | where: 'group', g.id %}
<section class="group" id="{{ g.id }}">
  <h2 class="group__title">{{ g.title }} <span class="group__years">{{ g.years }}</span></h2>
  <div class="stack">
    {%- for p in gitems %}
    {% include item-card.html item=p kind="project" %}
    {%- endfor %}
  </div>
</section>
{%- endfor %}
