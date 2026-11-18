---
layout: page
title: Experience
permalink: /experience/
lede: Full-time roles, newest first.
---
<ol class="timeline">
  {%- for role in site.data.experience %}
  <li class="timeline__item">
    {% include item-card.html item=role kind="role" h=2 %}
  </li>
  {%- endfor %}
</ol>
